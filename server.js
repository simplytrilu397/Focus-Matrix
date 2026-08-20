/**
 * FocusMatrix — Google Cloud Run Web Server & Firestore Backend
 * Provides REST APIs, static asset delivery, and secure GCP Firestore data sync.
 */

const express = require('express');
const path = require('path');
const { Firestore } = require('@google-cloud/firestore');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT_ID;

app.use(express.json());
app.use(express.static(path.join(__dirname)));
app.use(express.static('.'));

// Explicit static asset routes to guarantee delivery in any cloud container
app.get('/index.css', (req, res) => {
  res.setHeader('Content-Type', 'text/css');
  res.sendFile(path.join(__dirname, 'index.css'));
});

app.get('/app.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'app.js'));
});

app.get('/gate-materials.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'gate-materials.js'));
});


// -------------------------------------------------------------------------
// 1. Initialize Cloud Firestore Client with Graceful Local Fallback
// -------------------------------------------------------------------------
let db = null;
let firestoreConnected = false;

try {
  const firestoreOptions = {};
  if (PROJECT_ID) {
    firestoreOptions.projectId = PROJECT_ID;
  }
  db = new Firestore(firestoreOptions);
  firestoreConnected = true;
  console.log(`✓ Cloud Firestore client initialized (Project: ${PROJECT_ID || 'ADC Default'})`);
} catch (err) {
  console.warn('⚠️ Cloud Firestore initialized in local fallback mode:', err.message);
  firestoreConnected = false;
}

// -------------------------------------------------------------------------
// 2. Default Seed Dataset (GATE CS & Engineering Mathematics)
// -------------------------------------------------------------------------
const DEFAULT_GATE_SUBJECTS = [
  {
    id: 'sub_1',
    subject: 'Engineering Mathematics',
    topic: 'Calculus — Integration by Parts & Definite Integrals',
    weakness: 8.5,
    weightage: 25,
    daysLeft: 4,
    hoursAllocated: 3.5,
    confidence: 'low',
    spiScore: 92,
    tier: 'critical',
    completed: false,
    dateAdded: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'sub_2',
    subject: 'Operating Systems',
    topic: 'Virtual Memory, Multi-level Paging & TLB EMAT',
    weakness: 8.0,
    weightage: 25,
    daysLeft: 5,
    hoursAllocated: 3.0,
    confidence: 'low',
    spiScore: 88,
    tier: 'critical',
    completed: false,
    dateAdded: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'sub_3',
    subject: 'Data Structures & Algorithms',
    topic: 'Graph Algorithms — Shortest Paths & Negative Edges',
    weakness: 7.0,
    weightage: 20,
    daysLeft: 9,
    hoursAllocated: 2.5,
    confidence: 'medium',
    spiScore: 74,
    tier: 'high',
    completed: false,
    dateAdded: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'sub_4',
    subject: 'Database Management Systems',
    topic: 'Normalization & Functional Dependencies (BCNF / 3NF)',
    weakness: 6.5,
    weightage: 18,
    daysLeft: 12,
    hoursAllocated: 2.0,
    confidence: 'medium',
    spiScore: 68,
    tier: 'high',
    completed: false,
    dateAdded: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: 'sub_5',
    subject: 'Computer Networks',
    topic: 'IPv4 Addressing, CIDR Subnetting & Supernetting',
    weakness: 4.0,
    weightage: 15,
    daysLeft: 18,
    hoursAllocated: 1.5,
    confidence: 'high',
    spiScore: 48,
    tier: 'medium',
    completed: false,
    dateAdded: new Date(Date.now() - 86400000 * 5).toISOString()
  }
];

// In-memory cache for fast response and local offline dev
let memorySubjectsCache = [...DEFAULT_GATE_SUBJECTS];
let memoryProgressCache = {};

// -------------------------------------------------------------------------
// 3. REST API Endpoints
// -------------------------------------------------------------------------

// Health & Readiness Check for Cloud Run
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'focusmatrix-cloud-run',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    firestoreReady: firestoreConnected,
    environment: process.env.NODE_ENV || 'production'
  });
});

// GET /api/subjects — Retrieve all tracked study subjects
app.get('/api/subjects', async (req, res) => {
  try {
    if (firestoreConnected && db) {
      const snapshot = await db.collection('subjects').get();
      if (!snapshot.empty) {
        const subjects = [];
        snapshot.forEach(doc => subjects.push({ id: doc.id, ...doc.data() }));
        memorySubjectsCache = subjects;
        return res.json({ success: true, source: 'firestore', data: subjects });
      }
    }
    res.json({ success: true, source: 'cache', data: memorySubjectsCache });
  } catch (err) {
    console.warn('Error reading from Firestore, using cache:', err.message);
    res.json({ success: true, source: 'cache', data: memorySubjectsCache });
  }
});

// POST /api/subjects — Save/Sync subjects list
app.post('/api/subjects', async (req, res) => {
  const { subjects } = req.body;
  if (!Array.isArray(subjects)) {
    return res.status(400).json({ success: false, error: 'Expected an array of subjects' });
  }

  memorySubjectsCache = subjects;

  try {
    if (firestoreConnected && db) {
      const batch = db.batch();
      subjects.forEach(sub => {
        const docRef = db.collection('subjects').doc(sub.id || `sub_${Date.now()}`);
        batch.set(docRef, sub, { merge: true });
      });
      await batch.commit();
      return res.json({ success: true, message: 'Synced with Cloud Firestore', count: subjects.length });
    }
    res.json({ success: true, message: 'Saved to local memory cache', count: subjects.length });
  } catch (err) {
    console.warn('Firestore write warning:', err.message);
    res.json({ success: true, message: 'Saved to memory (Firestore offline)', count: subjects.length });
  }
});

// DELETE /api/subjects/:id — Delete a topic
app.delete('/api/subjects/:id', async (req, res) => {
  const { id } = req.params;
  memorySubjectsCache = memorySubjectsCache.filter(s => s.id !== id);

  try {
    if (firestoreConnected && db) {
      await db.collection('subjects').doc(id).delete();
    }
    res.json({ success: true, deletedId: id });
  } catch (err) {
    res.json({ success: true, deletedId: id, warning: err.message });
  }
});

// GET /api/materials — Get complete GATE syllabus dataset
app.get('/api/materials', (req, res) => {
  try {
    const { GATE_MATERIALS } = require('./gate-materials');
    res.json({ success: true, data: GATE_MATERIALS });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Could not load GATE materials repository' });
  }
});

// POST /api/practice/progress — Track practice problem solutions
app.post('/api/practice/progress', async (req, res) => {
  const { questionId, selectedIndex, isCorrect, userId } = req.body;
  if (!questionId) {
    return res.status(400).json({ success: false, error: 'Missing questionId' });
  }

  memoryProgressCache[questionId] = { selectedIndex, isCorrect, timestamp: new Date().toISOString() };

  try {
    if (firestoreConnected && db) {
      const collectionName = userId ? `users/${userId}/practiceProgress` : 'practiceProgress';
      await db.collection(collectionName).doc(questionId).set({
        questionId,
        selectedIndex,
        isCorrect,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
    res.json({ success: true });
  } catch (err) {
    res.json({ success: true, warning: 'Cached locally' });
  }
});

// POST /api/assistant/chat — Secure AI Study Assistant Endpoint (Routed via backend)
app.post('/api/assistant/chat', async (req, res) => {
  const { message, subjects } = req.body;
  const userMsg = (message || '').toLowerCase().trim();
  const activeSubjects = Array.isArray(subjects) ? subjects.filter(s => !s.completed) : memorySubjectsCache.filter(s => !s.completed);
  const sorted = [...activeSubjects].sort((a, b) => (b.spiScore || 0) - (a.spiScore || 0));
  const top = sorted[0];
  const critical = activeSubjects.filter(s => s.tier === 'critical');

  // Rule-based high-speed intelligent response
  let reply = '';
  if (userMsg.match(/^(hi|hello|hey)/)) {
    reply = '<p>Hey! 👋 I\'m your FocusMatrix GATE AI Coach. Try asking: <em>"What should I study today?"</em> or <em>"Which topics are critical?"</em></p>';
  } else if (userMsg.includes('today') || userMsg.includes('study now') || userMsg.includes('focus') || userMsg.includes('start')) {
    if (!top) {
      reply = '<p>No active topics found! Add topics via the ⚡ Calculator tab to generate your priority ranking.</p>';
    } else {
      reply = `<p><strong>Today's top GATE priority:</strong> <em>${top.topic}</em> (${top.subject})</p><p>SPI Score: <strong>${top.spiScore}/100</strong> (${top.tier.toUpperCase()} priority). Exam runway: <strong>${top.daysLeft} days</strong>. Recommended block: <strong>${top.hoursAllocated} hrs</strong>.</p>`;
    }
  } else if (userMsg.includes('critical') || userMsg.includes('urgent')) {
    if (!critical.length) {
      reply = '<p>No critical topics right now! You are in great shape. Keep revising your moderate priority concepts. 💪</p>';
    } else {
      reply = `<p><strong>${critical.length} critical GATE topics:</strong></p><ul>${critical.map(s => `<li><strong>${s.topic}</strong> (${s.subject}) — SPI ${s.spiScore}, ${s.daysLeft} days remaining</li>`).join('')}</ul>`;
    }
  } else if (userMsg.includes('plan') || userMsg.includes('schedule') || userMsg.includes('tomorrow')) {
    const top3 = sorted.slice(0, 3);
    reply = `<p><strong>Optimized Sprint Plan:</strong></p><ul>${top3.map((s, i) => `<li><strong>${i + 1}. ${s.topic}</strong> (${s.subject}) — ${s.hoursAllocated} hrs</li>`).join('')}</ul><p>Total Estimated Study Time: <strong>${top3.reduce((a, s) => a + (s.hoursAllocated || 0), 0).toFixed(1)} hrs</strong></p>`;
  } else if (userMsg.includes('progress') || userMsg.includes('done')) {
    const total = memorySubjectsCache.length;
    const completed = memorySubjectsCache.filter(s => s.completed).length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    reply = `<p>Current Progress: <strong>${completed}/${total}</strong> topics completed (<strong>${pct}%</strong>). ${pct >= 80 ? '🎉 Outstanding consistency!' : 'Keep going! 🔥'}</p>`;
  } else {
    reply = `<p>I'm analyzing your Subject Priority Index (SPI). Try asking:</p><ul><li>What should I study today?</li><li>Which GATE topics are critical?</li><li>Give me a revision plan for tomorrow</li><li>Show my progress</li></ul>`;
  }

  res.json({ success: true, reply });
});

// Fallback for Single Page Application routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start listening on Cloud Run PORT
app.listen(PORT, '0.0.0.0', () => {
  console.log(`===================================================`);
  console.log(`🚀 FocusMatrix Cloud Server running on port ${PORT}`);
  console.log(`🌐 Local URL: http://localhost:${PORT}`);
  console.log(`☁️ Cloud Run Ready: Yes (0.0.0.0:${PORT})`);
  console.log(`===================================================`);
});
