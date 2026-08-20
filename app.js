/**
 * FocusMatrix — Subject Priority Index & Study Engine
 * Clean Tab-Based Architecture & AI Assistant
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. Initial State & Realistic Default Dataset
  // -------------------------------------------------------------------------
  const DEFAULT_SUBJECTS = [
    {
      id: 'sub_1',
      subject: 'Mathematics',
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
      subject: 'Physics',
      topic: 'Electromagnetism — Faraday\'s & Lenz\'s Laws',
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
      subject: 'Chemistry',
      topic: 'Organic Reaction Mechanisms & Stereochemistry',
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
      subject: 'Computer Science',
      topic: 'Dynamic Programming & Tree Traversals',
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
      subject: 'Biology',
      topic: 'Genetics & Molecular Inheritance Patterns',
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

  // -------------------------------------------------------------------------
  // Practice Repository
  // -------------------------------------------------------------------------
  const PRACTICE_REPO = {
    'Mathematics': {
      topics: [
        { name: 'Integration by Parts', weakness: '8.5/10' },
        { name: 'Definite Integrals', weakness: '8.0/10' },
        { name: 'Differential Equations', weakness: '7.5/10' },
        { name: '3D Geometry', weakness: '6.0/10' }
      ],
      questions: [
        {
          id: 'm_q1',
          topic: 'Integration by Parts',
          difficulty: 'Medium',
          prompt: 'Evaluate the indefinite integral ∫ x · e^x dx.',
          options: [
            'x · e^x - e^x + C',
            'x · e^x + e^x + C',
            '(x^2 / 2) · e^x + C',
            'e^x / x + C'
          ],
          correctIndex: 0,
          formula: '∫ u dv = u v - ∫ v du',
          solution: {
            step1: 'Identify parts using ILATE rule: Let u = x (algebraic) and dv = e^x dx (exponential).',
            step2: 'Compute derivatives: du = dx and v = ∫ e^x dx = e^x.',
            step3: 'Apply integration by parts formula: ∫ x e^x dx = x · e^x - ∫ e^x dx.',
            step4: 'Integrate e^x to get x e^x - e^x + C = e^x(x - 1) + C.',
            takeaway: 'Exam Tip: Always pick algebraic terms for u when combined with exponential functions.'
          }
        },
        {
          id: 'm_q2',
          topic: 'Definite Integrals',
          difficulty: 'Hard',
          prompt: 'Evaluate ∫[0 to π/2] (sin x) / (sin x + cos x) dx.',
          options: ['π/4', 'π/2', '1', '0'],
          correctIndex: 0,
          formula: 'King\'s Property: ∫[a to b] f(x)dx = ∫[a to b] f(a+b-x)dx',
          solution: {
            step1: 'Let I = ∫[0 to π/2] (sin x) / (sin x + cos x) dx.',
            step2: 'Apply King\'s Property: replace x with (π/2 - x). sin(π/2 - x) = cos x.',
            step3: 'So I = ∫[0 to π/2] (cos x) / (cos x + sin x) dx.',
            step4: 'Add 2I = ∫[0 to π/2] (sin x + cos x)/(sin x + cos x) dx = ∫[0 to π/2] 1 dx = π/2. Thus I = π/4.',
            takeaway: 'Exam Tip: When sine and cosine are symmetrical over [0, π/2], King\'s property simplifies the integral to (b-a)/2.'
          }
        }
      ]
    },
    'Physics': {
      topics: [
        { name: 'Faraday\'s & Lenz\'s Laws', weakness: '8.0/10' },
        { name: 'Inductance & RL Circuits', weakness: '7.5/10' },
        { name: 'AC Circuit Resonance', weakness: '6.5/10' }
      ],
      questions: [
        {
          id: 'p_q1',
          topic: 'Faraday\'s & Lenz\'s Laws',
          difficulty: 'Medium',
          prompt: 'A circular loop of radius 0.1 m is in a magnetic field B = 0.5 T perpendicular to the loop. If B drops to zero in 0.1 s, calculate the induced EMF.',
          options: ['0.157 V', '0.314 V', '0.05 V', '1.57 V'],
          correctIndex: 0,
          formula: 'EMF = -N · (dΦ / dt) where Φ = B · A',
          solution: {
            step1: 'Calculate loop area: A = π · r^2 = π · (0.1)^2 = 0.0314 m^2.',
            step2: 'Calculate initial magnetic flux: Φ_initial = B · A = 0.5 · 0.0314 = 0.0157 Wb.',
            step3: 'Final flux Φ_final = 0. ΔΦ = 0.0157 Wb over Δt = 0.1 s.',
            step4: 'Magnitude of EMF = ΔΦ / Δt = 0.0157 / 0.1 = 0.157 V.',
            takeaway: 'Exam Pitfall: Remember area A = π r^2, not 2 π r.'
          }
        }
      ]
    },
    'Chemistry': {
      topics: [
        { name: 'Organic Reaction Mechanisms', weakness: '7.0/10' },
        { name: 'Stereochemistry & Chirality', weakness: '6.5/10' }
      ],
      questions: [
        {
          id: 'c_q1',
          topic: 'Organic Reaction Mechanisms',
          difficulty: 'Hard',
          prompt: 'Which mechanism undergoes complete inversion of configuration at a chiral center?',
          options: ['SN2 Mechanism', 'SN1 Mechanism', 'E1 Mechanism', 'E2 Mechanism'],
          correctIndex: 0,
          formula: 'SN2: Bimolecular Nucleophilic Substitution with Walden Inversion',
          solution: {
            step1: 'Identify SN2 mechanism: Nucleophile attacks from the backside 180° opposite to the leaving group.',
            step2: 'Backside attack forces stereochemical inversion (Walden Inversion, like an umbrella turning inside out).',
            step3: 'Contrast with SN1: forms a planar carbocation intermediate yielding a racemic mixture (50% inversion, 50% retention).',
            step4: 'Hence SN2 produces 100% inverted configuration.',
            takeaway: 'Exam Fact: Primary alkyl halides heavily favor SN2 in polar aprotic solvents.'
          }
        }
      ]
    },
    'Computer Science': {
      topics: [
        { name: 'Dynamic Programming', weakness: '6.5/10' },
        { name: 'Tree Traversals', weakness: '5.5/10' }
      ],
      questions: [
        {
          id: 'cs_q1',
          topic: 'Dynamic Programming',
          difficulty: 'Medium',
          prompt: 'What is the time complexity to solve the 0/1 Knapsack Problem using Dynamic Programming with N items and capacity W?',
          options: ['O(N · W)', 'O(2^N)', 'O(N log N)', 'O(W^2)'],
          correctIndex: 0,
          formula: 'DP State: dp[i][w] = max(dp[i-1][w], val[i-1] + dp[i-1][w-wt[i-1]])',
          solution: {
            step1: 'Notice state dimensions: i goes from 1 to N, w goes from 0 to W.',
            step2: 'Total DP table size is (N+1) × (W+1).',
            step3: 'Filling each cell takes O(1) constant time lookups.',
            step4: 'Total time complexity is O(N · W) (pseudo-polynomial time).',
            takeaway: 'Exam Fact: 0/1 Knapsack is NP-Complete, so O(N·W) is pseudo-polynomial in W.'
          }
        }
      ]
    },
    'Biology': {
      topics: [
        { name: 'Genetics & Inheritance', weakness: '4.0/10' }
      ],
      questions: [
        {
          id: 'b_q1',
          topic: 'Genetics & Inheritance',
          difficulty: 'Easy',
          prompt: 'In a monohybrid cross between two heterozygous tall pea plants (Tt × Tt), what is the expected phenotypic ratio of Tall to Dwarf offspring?',
          options: ['3 : 1', '1 : 2 : 1', '9 : 3 : 3 : 1', '1 : 1'],
          correctIndex: 0,
          formula: 'Monohybrid Punnett Square: TT, Tt, Tt, tt',
          solution: {
            step1: 'Cross Tt × Tt.',
            step2: 'Genotypes produced: 1 TT, 2 Tt, 1 tt.',
            step3: 'Since T is dominant, TT and Tt are Tall (3 total), tt is Dwarf (1 total).',
            step4: 'Phenotypic ratio is 3 Tall : 1 Dwarf (3:1).',
            takeaway: 'Exam Fact: Genotypic ratio is 1:2:1, but Phenotypic ratio is 3:1.'
          }
        }
      ]
    }
  };

  // -------------------------------------------------------------------------
  // 2. Application State
  // -------------------------------------------------------------------------
  let appState = {
    activeTab: 'home',
    subjects: loadStoredSubjects(),
    currentFilter: 'all',
    searchQuery: '',
    sortOption: 'spi_desc',
    currentFocusId: null,
    timer: {
      totalSeconds: 25 * 60,
      remainingSeconds: 25 * 60,
      isRunning: false,
      intervalId: null
    },
    theme: localStorage.getItem('fm_theme') || 'dark',
    practice: {
      activeSubject: 'Mathematics',
      selectedTopic: null,
      activeDifficulty: 'all',
      answers: {},
      solvedQuestions: new Set(),
      openSolutions: new Set()
    }
  };

  // -------------------------------------------------------------------------
  // 3. SPI Calculation Formula
  // -------------------------------------------------------------------------
  function calculateSPI(weakness, weightage, daysLeft) {
    const w = parseFloat(weakness) || 1;
    const wt = parseFloat(weightage) || 5;
    const d = parseFloat(daysLeft) || 30;

    const weaknessPts = Math.min(35, w * 3.5);
    const weightagePts = Math.min(35, (wt / 35.0) * 35);
    const urgencyRatio = Math.max(0, 1 - (d - 1) / 30);
    const urgencyPts = Math.max(3, Math.min(30, urgencyRatio * 30));

    const totalRaw = weaknessPts + weightagePts + urgencyPts;
    const finalScore = Math.min(100, Math.max(10, Math.round(totalRaw)));

    let tier = 'low';
    let tierText = 'LOW PRIORITY';
    let summary = 'Steady maintenance. Periodic review is sufficient.';
    let recommendation = 'Schedule brief flashcard recall sessions twice a week.';

    if (finalScore >= 75) {
      tier = 'critical';
      tierText = 'CRITICAL PRIORITY';
      summary = 'High exam weight combined with significant concept gap and impending deadline.';
      recommendation = 'Schedule 2 deep-focus blocks (90 min each) today. Solve 10 PYQs and draft formula cheat sheet.';
    } else if (finalScore >= 60) {
      tier = 'high';
      tierText = 'HIGH PRIORITY';
      summary = 'Important topic requiring active problem-solving drills this week.';
      recommendation = 'Dedicate 1 study sprint today. Focus on moderate-difficulty practice questions.';
    } else if (finalScore >= 40) {
      tier = 'medium';
      tierText = 'MODERATE PRIORITY';
      summary = 'Moderate syllabus weight. Review core formulas and summary notes.';
      recommendation = 'Allocate a 45-minute revision block before the weekend.';
    }

    return {
      score: finalScore,
      tier,
      tierText,
      summary,
      recommendation,
      breakdown: {
        weaknessPts: parseFloat(weaknessPts.toFixed(1)),
        weightagePts: parseFloat(weightagePts.toFixed(1)),
        urgencyPts: parseFloat(urgencyPts.toFixed(1))
      }
    };
  }

  // -------------------------------------------------------------------------
  // 4. Persistence
  // -------------------------------------------------------------------------
  function loadStoredSubjects() {
    try {
      const stored = localStorage.getItem('fm_subjects_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Storage read error:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_SUBJECTS));
  }

  function saveSubjects() {
    try {
      localStorage.setItem('fm_subjects_v1', JSON.stringify(appState.subjects));
    } catch (e) {
      console.error('Storage save error:', e);
    }
  }

  // -------------------------------------------------------------------------
  // 5. Tab Navigation
  // -------------------------------------------------------------------------
  function switchTab(tabId) {
    appState.activeTab = tabId;

    // Desktop nav buttons
    document.querySelectorAll('.nav-tab').forEach(btn => {
      const isActive = btn.getAttribute('data-tab') === tabId;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Mobile bottom nav buttons
    document.querySelectorAll('.bottom-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });

    // Tab panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
      const isTarget = panel.getAttribute('data-tab') === tabId;
      if (isTarget) {
        panel.removeAttribute('hidden');
        panel.classList.add('active');
      } else {
        panel.setAttribute('hidden', '');
        panel.classList.remove('active');
      }
    });

    // Scroll to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // -------------------------------------------------------------------------
  // 6. Home Tab — Today's Focus & Timer
  // -------------------------------------------------------------------------
  function updateTodaysFocus() {
    const activeSubjects = appState.subjects.filter(s => !s.completed);
    const total = appState.subjects.length;
    const completedCount = appState.subjects.filter(s => s.completed).length;
    const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

    const progressTextEl = document.getElementById('dailyProgressText');
    const progressBarEl = document.getElementById('dailyProgressBar');
    if (progressTextEl) progressTextEl.textContent = `${completedCount} of ${total} Topics Done (${pct}%)`;
    if (progressBarEl) progressBarEl.style.width = `${pct}%`;

    const badgeEl = document.getElementById('focusSubjectBadge');
    const titleEl = document.getElementById('focusTopicTitle');
    const reasonEl = document.getElementById('focusTopicReason');
    const scoreEl = document.getElementById('focusTopicScore');
    const daysEl = document.getElementById('focusTopicDays');
    const hoursEl = document.getElementById('focusTopicHours');

    if (!titleEl) return;

    if (activeSubjects.length === 0) {
      if (badgeEl) badgeEl.textContent = 'All Caught Up';
      titleEl.textContent = '🎉 All Tracked Topics Completed!';
      if (reasonEl) reasonEl.textContent = 'Great job clearing your study index! Add new topics via the Calculator tab.';
      if (scoreEl) scoreEl.textContent = '100%';
      if (daysEl) daysEl.textContent = 'Ready';
      if (hoursEl) hoursEl.textContent = '0 hrs';
      appState.currentFocusId = null;
      return;
    }

    let topTopic = activeSubjects.find(s => s.id === appState.currentFocusId);
    if (!topTopic) {
      activeSubjects.sort((a, b) => b.spiScore - a.spiScore);
      topTopic = activeSubjects[0];
      appState.currentFocusId = topTopic.id;
    }

    if (badgeEl) badgeEl.textContent = topTopic.subject;
    titleEl.textContent = topTopic.topic;
    if (reasonEl) reasonEl.textContent = `Highest revision priority (${topTopic.weightage}% paper weight, weakness ${topTopic.weakness}/10).`;
    if (scoreEl) {
      scoreEl.textContent = `${topTopic.spiScore} / 100`;
      scoreEl.className = `stat-value score-${topTopic.tier}`;
    }
    if (daysEl) daysEl.textContent = `${topTopic.daysLeft} Day${topTopic.daysLeft === 1 ? '' : 's'}`;
    if (hoursEl) hoursEl.textContent = `${topTopic.hoursAllocated} hrs`;
  }

  function handleMarkFocusDone() {
    if (!appState.currentFocusId) return;
    const item = appState.subjects.find(s => s.id === appState.currentFocusId);
    if (item) {
      item.completed = true;
      saveSubjects();
      updateTodaysFocus();
      renderMasterboard();
      showToast(`🎉 Completed "${item.topic}"!`);
    }
  }

  function handleShuffleFocus() {
    const active = appState.subjects.filter(s => !s.completed);
    if (active.length <= 1) {
      showToast('ℹ️ No other active topics to shuffle.');
      return;
    }
    const idx = active.findIndex(s => s.id === appState.currentFocusId);
    const nextIdx = (idx + 1) % active.length;
    appState.currentFocusId = active[nextIdx].id;
    updateTodaysFocus();
    showToast(`🎯 Shifted Focus to "${active[nextIdx].topic}"`);
  }

  // Timer
  function toggleTimer() {
    if (appState.timer.isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  }

  function startTimer() {
    appState.timer.isRunning = true;
    const btnText = document.getElementById('timerBtnText');
    if (btnText) btnText.textContent = '⏸ Pause Sprint';

    appState.timer.intervalId = setInterval(() => {
      if (appState.timer.remainingSeconds > 0) {
        appState.timer.remainingSeconds--;
        renderTimerDisplay();
      } else {
        clearInterval(appState.timer.intervalId);
        appState.timer.isRunning = false;
        if (btnText) btnText.textContent = '▶ Start Sprint';
        showToast('⏰ 25-Min Sprint Complete! Take a break.');
      }
    }, 1000);
  }

  function pauseTimer() {
    clearInterval(appState.timer.intervalId);
    appState.timer.isRunning = false;
    const btnText = document.getElementById('timerBtnText');
    if (btnText) btnText.textContent = '▶ Resume Sprint';
  }

  function resetTimer() {
    clearInterval(appState.timer.intervalId);
    appState.timer.isRunning = false;
    appState.timer.remainingSeconds = appState.timer.totalSeconds;
    const btnText = document.getElementById('timerBtnText');
    if (btnText) btnText.textContent = '▶ Start Sprint';
    renderTimerDisplay();
  }

  function renderTimerDisplay() {
    const display = document.getElementById('timerDisplay');
    if (!display) return;
    const mins = Math.floor(appState.timer.remainingSeconds / 60);
    const secs = appState.timer.remainingSeconds % 60;
    display.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  // -------------------------------------------------------------------------
  // 7. Calculator & Live Results
  // -------------------------------------------------------------------------
  function updateLiveCalculatorResults() {
    const weaknessEl = document.getElementById('weaknessSlider');
    const weightageEl = document.getElementById('weightageSlider');
    const urgencyEl = document.getElementById('urgencySlider');
    const hoursEl = document.getElementById('hoursSlider');
    const topicEl = document.getElementById('topicNameInput');

    if (!weaknessEl) return;

    const weakness = parseFloat(weaknessEl.value);
    const weightage = parseFloat(weightageEl.value);
    const urgency = parseFloat(urgencyEl.value);
    const hours = parseFloat(hoursEl.value);
    const topic = topicEl ? (topicEl.value.trim() || 'Untitled Topic') : 'Untitled Topic';

    document.getElementById('weaknessValBadge').textContent = `${weakness} / 10`;
    document.getElementById('weightageValBadge').textContent = `${weightage}%`;
    document.getElementById('urgencyValBadge').textContent = `${urgency} Day${urgency === 1 ? '' : 's'}`;
    document.getElementById('hoursValBadge').textContent = `${hours.toFixed(1)} hrs`;

    const result = calculateSPI(weakness, weightage, urgency);

    document.getElementById('resultScoreNum').textContent = result.score;
    document.getElementById('resultTopicHeading').textContent = topic;
    document.getElementById('resultSummaryText').textContent = result.summary;
    document.getElementById('resultTierText').textContent = result.tierText;
    document.getElementById('resultTierBadge').className = `tier-badge tier-${result.tier}`;

    // SVG Gauge
    const circle = document.getElementById('gaugeCircle');
    if (circle) {
      const circumference = 402.12;
      const offset = circumference - (result.score / 100) * circumference;
      circle.style.strokeDashoffset = offset;
      circle.style.stroke = result.tier === 'critical' ? '#f43f5e' : result.tier === 'high' ? '#f59e0b' : result.tier === 'medium' ? '#3b82f6' : '#10b981';
    }

    // Breakdown
    document.getElementById('breakdownWeaknessScore').textContent = `${result.breakdown.weaknessPts} / 35`;
    document.getElementById('barFillWeakness').style.width = `${(result.breakdown.weaknessPts / 35) * 100}%`;

    document.getElementById('breakdownWeightScore').textContent = `${result.breakdown.weightagePts} / 35`;
    document.getElementById('barFillWeight').style.width = `${(result.breakdown.weightagePts / 35) * 100}%`;

    document.getElementById('breakdownUrgencyScore').textContent = `${result.breakdown.urgencyPts} / 30`;
    document.getElementById('barFillUrgency').style.width = `${(result.breakdown.urgencyPts / 30) * 100}%`;

    document.getElementById('recTitle').textContent = `${result.tierText} Strategy`;
    document.getElementById('recDescription').textContent = result.recommendation;
  }

  function handleCalculateAndAdd() {
    const subjectEl = document.getElementById('subjectSelect');
    const topicEl = document.getElementById('topicNameInput');
    const topic = topicEl ? topicEl.value.trim() : '';

    if (!topic) {
      showToast('⚠️ Please enter a topic name.', 'warning');
      if (topicEl) topicEl.focus();
      return;
    }

    const weakness = parseFloat(document.getElementById('weaknessSlider').value);
    const weightage = parseFloat(document.getElementById('weightageSlider').value);
    const daysLeft = parseFloat(document.getElementById('urgencySlider').value);
    const hoursAllocated = parseFloat(document.getElementById('hoursSlider').value);
    const confidenceInput = document.querySelector('input[name="confidenceLevel"]:checked');
    const confidence = confidenceInput ? confidenceInput.value : 'medium';

    const result = calculateSPI(weakness, weightage, daysLeft);

    const newSubject = {
      id: 'sub_' + Date.now(),
      subject: subjectEl ? subjectEl.value : 'General',
      topic,
      weakness,
      weightage,
      daysLeft,
      hoursAllocated,
      confidence,
      spiScore: result.score,
      tier: result.tier,
      completed: false,
      dateAdded: new Date().toISOString()
    };

    appState.subjects.unshift(newSubject);
    saveSubjects();
    updateTodaysFocus();
    renderMasterboard();
    showToast(`✓ Added "${topic}" (SPI: ${result.score})`);

    if (topicEl) {
      topicEl.value = '';
      topicEl.placeholder = 'Add another topic...';
    }
  }

  function applyPreset(presetType) {
    const wSlider = document.getElementById('weaknessSlider');
    const wtSlider = document.getElementById('weightageSlider');
    const uSlider = document.getElementById('urgencySlider');
    const hSlider = document.getElementById('hoursSlider');

    if (!wSlider) return;

    if (presetType === 'panic') {
      wSlider.value = 9;
      wtSlider.value = 35;
      uSlider.value = 2;
      hSlider.value = 4.0;
      showToast('🚨 Loaded Panic Preset');
    } else if (presetType === 'balanced') {
      wSlider.value = 5.5;
      wtSlider.value = 20;
      uSlider.value = 14;
      hSlider.value = 2.5;
      showToast('⚖️ Loaded Balanced Preset');
    } else if (presetType === 'highyield') {
      wSlider.value = 7.5;
      wtSlider.value = 30;
      uSlider.value = 7;
      hSlider.value = 3.0;
      showToast('💎 Loaded High-Yield Preset');
    }
    updateLiveCalculatorResults();
  }

  // -------------------------------------------------------------------------
  // 8. My Subjects (Masterboard) Rendering
  // -------------------------------------------------------------------------
  function renderMasterboard() {
    const listEl = document.getElementById('subjectCardList');
    if (!listEl) return;

    let list = [...appState.subjects];

    if (appState.searchQuery) {
      const q = appState.searchQuery.toLowerCase();
      list = list.filter(item =>
        item.topic.toLowerCase().includes(q) ||
        item.subject.toLowerCase().includes(q)
      );
    }

    if (appState.currentFilter === 'critical') {
      list = list.filter(i => !i.completed && i.tier === 'critical');
    } else if (appState.currentFilter === 'high') {
      list = list.filter(i => !i.completed && i.tier === 'high');
    } else if (appState.currentFilter === 'medium') {
      list = list.filter(i => !i.completed && (i.tier === 'medium' || i.tier === 'low'));
    } else if (appState.currentFilter === 'completed') {
      list = list.filter(i => i.completed);
    }

    list.sort((a, b) => {
      if (appState.sortOption === 'spi_desc') return b.spiScore - a.spiScore;
      if (appState.sortOption === 'spi_asc') return a.spiScore - b.spiScore;
      if (appState.sortOption === 'days_asc') return a.daysLeft - b.daysLeft;
      if (appState.sortOption === 'weakness_desc') return b.weakness - a.weakness;
      if (appState.sortOption === 'weight_desc') return b.weightage - a.weightage;
      return 0;
    });

    const total = appState.subjects.length;
    const active = appState.subjects.filter(s => !s.completed);
    const critCount = active.filter(s => s.tier === 'critical').length;
    const highCount = active.filter(s => s.tier === 'high').length;
    const medCount = active.filter(s => s.tier === 'medium' || s.tier === 'low').length;
    const doneCount = appState.subjects.filter(s => s.completed).length;

    document.getElementById('totalSubjectsCount').textContent = total;
    document.getElementById('countAll').textContent = total;
    document.getElementById('countCrit').textContent = critCount;
    document.getElementById('countHigh').textContent = highCount;
    document.getElementById('countMed').textContent = medCount;
    document.getElementById('countDone').textContent = doneCount;

    if (active.length > 0) {
      document.getElementById('distCritSeg').style.width = `${(critCount / active.length) * 100}%`;
      document.getElementById('distHighSeg').style.width = `${(highCount / active.length) * 100}%`;
      document.getElementById('distMedSeg').style.width = `${(medCount / active.length) * 100}%`;
    } else {
      document.getElementById('distCritSeg').style.width = '0%';
      document.getElementById('distHighSeg').style.width = '0%';
      document.getElementById('distMedSeg').style.width = '100%';
    }

    if (list.length === 0) {
      listEl.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">📂</span>
          <div class="empty-title">No Subjects Found</div>
          <p class="empty-desc">No topics match your current filter or search criteria.</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = list.map(item => {
      const tierClass = item.tier === 'critical' ? 'pill-crit' : item.tier === 'high' ? 'pill-high' : item.tier === 'medium' ? 'pill-med' : 'pill-low';
      const completedClass = item.completed ? 'is-completed' : '';

      return `
        <div class="subject-card ${completedClass}" data-id="${item.id}" role="listitem">
          <div class="sc-top">
            <div class="sc-meta">
              <span class="sc-domain">${escapeHTML(item.subject)}</span>
              <h4 class="sc-title">${escapeHTML(item.topic)}</h4>
            </div>
            <div class="sc-score ${tierClass}">
              <span class="sc-score-num">${item.spiScore}</span>
              <span class="sc-score-tier">${item.tier.toUpperCase()}</span>
            </div>
          </div>

          <div class="sc-stats">
            <div class="sc-stat">Runway: <span>${item.daysLeft}d</span></div>
            <div class="sc-stat">Weakness: <span>${item.weakness}/10</span></div>
            <div class="sc-stat">Allocated: <span>${item.hoursAllocated}h</span></div>
          </div>

          <div class="sc-actions">
            <button type="button" class="btn-sc ${item.completed ? 'done' : ''}" data-action="toggle-complete" data-id="${item.id}">
              ${item.completed ? '✓ Completed' : 'Mark Done'}
            </button>
            <button type="button" class="btn-sc icon" data-action="focus-now" data-id="${item.id}" title="Set as Today's Focus">🎯</button>
            <button type="button" class="btn-sc icon del" data-action="delete" data-id="${item.id}" title="Delete">🗑️</button>
          </div>
        </div>
      `;
    }).join('');
  }

  // -------------------------------------------------------------------------
  // 9. Practice Tab Rendering & Diagnostic Solver
  // -------------------------------------------------------------------------
  function renderPractice() {
    const subjectData = PRACTICE_REPO[appState.practice.activeSubject];
    if (!subjectData) return;

    // Topic chips
    const chipContainer = document.getElementById('weakTopicsChipContainer');
    if (chipContainer) {
      chipContainer.innerHTML = subjectData.topics.map(t => {
        const isSelected = appState.practice.selectedTopic === t.name;
        return `
          <button type="button" class="topic-chip ${isSelected ? 'selected' : ''}" data-topic="${escapeHTML(t.name)}">
            <span>${escapeHTML(t.name)}</span>
            <span class="gap-badge">${t.weakness}</span>
          </button>
        `;
      }).join('');
    }

    // Filter questions
    let questions = [...subjectData.questions];
    if (appState.practice.selectedTopic) {
      questions = questions.filter(q => q.topic.includes(appState.practice.selectedTopic) || appState.practice.selectedTopic.includes(q.topic));
    }
    if (appState.practice.activeDifficulty !== 'all') {
      questions = questions.filter(q => q.difficulty.toLowerCase() === appState.practice.activeDifficulty.toLowerCase());
    }

    let solvedCount = 0;
    questions.forEach(q => {
      if (appState.practice.solvedQuestions.has(q.id)) solvedCount++;
    });

    const solvedEl = document.getElementById('practiceSolvedCount');
    if (solvedEl) solvedEl.textContent = `${solvedCount} / ${questions.length} Solved`;

    const feedTitle = document.getElementById('practiceQuestionFeedTitle');
    if (feedTitle) {
      feedTitle.textContent = appState.practice.selectedTopic
        ? `Questions for "${appState.practice.selectedTopic}"`
        : `Diagnostic Questions (${appState.practice.activeSubject})`;
    }

    const qContainer = document.getElementById('questionListContainer');
    if (!qContainer) return;

    if (questions.length === 0) {
      qContainer.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">📝</span>
          <div class="empty-title">No Questions Found</div>
          <p class="empty-desc">Try selecting another topic or difficulty filter above.</p>
        </div>
      `;
      return;
    }

    const letters = ['A', 'B', 'C', 'D'];

    qContainer.innerHTML = questions.map((q, qIndex) => {
      const selectedAns = appState.practice.answers[q.id];
      const isSolved = appState.practice.solvedQuestions.has(q.id);
      const isSolutionOpen = appState.practice.openSolutions.has(q.id);

      const optionsHTML = q.options.map((opt, oIndex) => {
        let optClass = '';
        if (selectedAns === oIndex) {
          optClass = isSolved ? (oIndex === q.correctIndex ? 'correct' : 'incorrect') : 'selected';
        } else if (isSolved && oIndex === q.correctIndex) {
          optClass = 'correct';
        }

        return `
          <button type="button" class="q-option-btn ${optClass}" data-qid="${q.id}" data-optindex="${oIndex}">
            <span class="opt-letter">${letters[oIndex]}</span>
            <span>${escapeHTML(opt)}</span>
          </button>
        `;
      }).join('');

      return `
        <div class="q-card" data-qid="${q.id}" role="listitem">
          <div class="q-meta">
            <span class="q-topic-tag">📌 ${escapeHTML(q.topic)}</span>
            <span class="q-diff-badge diff-${q.difficulty}">${q.difficulty}</span>
          </div>

          <p class="q-prompt"><strong>Q${qIndex + 1}:</strong> ${escapeHTML(q.prompt)}</p>
          ${q.formula ? `<div class="q-hint">💡 Hint: ${escapeHTML(q.formula)}</div>` : ''}

          <div class="q-options">${optionsHTML}</div>

          <div class="q-actions">
            <button type="button" class="btn-check" data-action="check-answer" data-qid="${q.id}">✓ Check Answer</button>
            <button type="button" class="btn-stuck" data-action="toggle-solution" data-qid="${q.id}">
              ${isSolutionOpen ? '▲ Hide Solution' : '🆘 I\'m Stuck! (Step-by-Step)'}
            </button>
          </div>

          <div class="solution-drawer ${isSolutionOpen ? 'open' : ''}">
            <div class="solution-header">
              <span class="solution-title">📖 Step-by-Step Solution</span>
              <span class="solution-correct">Correct: Option ${letters[q.correctIndex]}</span>
            </div>
            <div class="solution-steps">
              <div class="solution-step">
                <span class="step-num-circle">1</span>
                <div class="step-content">
                  <div class="step-title">Concept Recognition</div>
                  <p class="step-body">${escapeHTML(q.solution.step1)}</p>
                </div>
              </div>
              <div class="solution-step">
                <span class="step-num-circle">2</span>
                <div class="step-content">
                  <div class="step-title">Formula & Substitution</div>
                  <p class="step-body">${escapeHTML(q.solution.step2)}</p>
                </div>
              </div>
              <div class="solution-step">
                <span class="step-num-circle">3</span>
                <div class="step-content">
                  <div class="step-title">Algebraic Working</div>
                  <p class="step-body">${escapeHTML(q.solution.step3)}</p>
                </div>
              </div>
              <div class="solution-step">
                <span class="step-num-circle">4</span>
                <div class="step-content">
                  <div class="step-title">Final Result</div>
                  <p class="step-body">${escapeHTML(q.solution.step4)}</p>
                </div>
              </div>
            </div>
            <div class="takeaway">
              <strong>🎯 Exam Strategy:</strong> ${escapeHTML(q.solution.takeaway)}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // -------------------------------------------------------------------------
  // 10. AI Assistant Chatbot (Smart Rule-Based)
  // -------------------------------------------------------------------------
  function handleChatSubmit(userQuery) {
    const input = document.getElementById('chatInput');
    const query = (userQuery || (input ? input.value : '')).trim();
    if (!query) return;

    if (input) input.value = '';

    appendChatMessage('user', query);

    // Generate intelligent answer based on user's current study dataset
    setTimeout(() => {
      const response = generateAIResponse(query);
      appendChatMessage('bot', response);
    }, 400);
  }

  function appendChatMessage(sender, text) {
    const container = document.getElementById('chatMessages');
    if (!container) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender === 'user' ? 'user-msg' : 'bot-msg'}`;

    const avatar = sender === 'user' ? '👤' : '🤖';
    msgDiv.innerHTML = `
      <div class="msg-avatar">${avatar}</div>
      <div class="msg-bubble">${text}</div>
    `;

    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
  }

  function generateAIResponse(query) {
    const q = query.toLowerCase();
    const active = appState.subjects.filter(s => !s.completed);
    const critical = active.filter(s => s.tier === 'critical');
    const high = active.filter(s => s.tier === 'high');

    if (q.includes('what should i study') || q.includes('today') || q.includes('recommend')) {
      if (active.length === 0) {
        return '<p>🎉 You have completed all your tracked topics! Add new topics in the ⚡ <strong>Calculator</strong> tab to plan your next sprint.</p>';
      }
      active.sort((a, b) => b.spiScore - a.spiScore);
      const top = active[0];
      return `<p>🎯 Based on your Subject Priority Index, your #1 focus today should be:</p>
              <p><strong>${escapeHTML(top.topic)} (${escapeHTML(top.subject)})</strong></p>
              <ul>
                <li><strong>SPI Priority Score:</strong> ${top.spiScore}/100</li>
                <li><strong>Exam Runway:</strong> ${top.daysLeft} days left</li>
                <li><strong>Allocated Time:</strong> ${top.hoursAllocated} hours</li>
              </ul>
              <p><em>Reason:</em> It has high paper weightage (${top.weightage}%) and a concept weakness gap of ${top.weakness}/10.</p>`;
    }

    if (q.includes('critical') || q.includes('urgent') || q.includes('priority')) {
      if (critical.length === 0) {
        return '<p>✅ Good news! You currently have <strong>0 Critical Priority topics</strong>. Your highest priority topics are in the High/Moderate tier.</p>';
      }
      const list = critical.map(c => `<li><strong>${escapeHTML(c.topic)}</strong> (${c.subject}) — SPI ${c.spiScore}</li>`).join('');
      return `<p>🚨 You have <strong>${critical.length} Critical Priority topic(s)</strong> requiring immediate attention:</p>
              <ul>${list}</ul>
              <p>Focus on solving Previous Year Questions (PYQs) for these first!</p>`;
    }

    if (q.includes('tomorrow') || q.includes('plan') || q.includes('schedule')) {
      if (active.length === 0) return '<p>No active topics to schedule! All topics are marked done.</p>';
      active.sort((a, b) => b.spiScore - a.spiScore);
      const items = active.slice(0, 3).map((s, idx) =>
        `<li><strong>Sprint ${idx + 1} (${s.hoursAllocated} hrs):</strong> ${escapeHTML(s.topic)} [${s.subject}]</li>`
      ).join('');
      return `<p>📅 Here is your optimized revision plan for tomorrow:</p>
              <ul>${items}</ul>
              <p>💡 Tip: Use the 25-minute Pomodoro Sprint timer on the Home tab to stay in deep focus!</p>`;
    }

    if (q.includes('hours') || q.includes('time') || q.includes('duration')) {
      const totalHours = active.reduce((sum, s) => sum + parseFloat(s.hoursAllocated), 0);
      return `<p>⏱️ Total remaining revision hours across all active topics: <strong>${totalHours.toFixed(1)} hours</strong>.</p>
              <p>Break this down into 25-minute Pomodoro sessions (approx. ${Math.ceil(totalHours * 2)} sprints).</p>`;
    }

    if (q.includes('weight') || q.includes('highest') || q.includes('paper')) {
      if (active.length === 0) return '<p>No active topics available.</p>';
      const sorted = [...active].sort((a, b) => b.weightage - a.weightage);
      const top = sorted[0];
      return `<p>💎 The topic with the highest exam weightage in your list is:</p>
              <p><strong>${escapeHTML(top.topic)} (${top.subject})</strong> — ${top.weightage}% of exam paper!</p>`;
    }

    // Default friendly response
    return `<p>I evaluated your study list (${appState.subjects.length} topics total, ${active.length} active).</p>
            <p>You can ask me:</p>
            <ul>
              <li><em>"What should I study today?"</em></li>
              <li><em>"Which topics are most critical?"</em></li>
              <li><em>"Give me a study plan for tomorrow"</em></li>
              <li><em>"Which topic has the highest exam weight?"</em></li>
            </ul>`;
  }

  // -------------------------------------------------------------------------
  // 11. Theme & Utilities
  // -------------------------------------------------------------------------
  function initTheme() {
    if (appState.theme === 'light') {
      document.body.classList.add('theme-light');
    } else {
      document.body.classList.remove('theme-light');
    }
  }

  function toggleTheme() {
    const isLight = document.body.classList.toggle('theme-light');
    appState.theme = isLight ? 'light' : 'dark';
    localStorage.setItem('fm_theme', appState.theme);
    showToast(`Switched to ${appState.theme} mode`);
  }

  function showToast(msg, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = msg;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function exportStudyPlanJSON() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(appState.subjects, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', 'focusmatrix_study_plan.json');
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast('📥 Study Plan Exported as JSON');
  }

  // -------------------------------------------------------------------------
  // 12. Bind Event Listeners
  // -------------------------------------------------------------------------
  function bindEvents() {
    // Navigation (Desktop + Mobile)
    document.querySelectorAll('.nav-tab, .bottom-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        if (tabId) switchTab(tabId);
      });
    });

    // Theme toggle
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    // Home Tab Actions
    const markDoneBtn = document.getElementById('btnMarkFocusDone');
    if (markDoneBtn) markDoneBtn.addEventListener('click', handleMarkFocusDone);

    const nextFocusBtn = document.getElementById('btnNextFocusTopic');
    if (nextFocusBtn) nextFocusBtn.addEventListener('click', handleShuffleFocus);

    const timerToggleBtn = document.getElementById('btnTimerToggle');
    if (timerToggleBtn) timerToggleBtn.addEventListener('click', toggleTimer);

    const timerResetBtn = document.getElementById('btnTimerReset');
    if (timerResetBtn) timerResetBtn.addEventListener('click', resetTimer);

    // Calculator Sliders & Form
    ['weaknessSlider', 'weightageSlider', 'urgencySlider', 'hoursSlider', 'topicNameInput', 'subjectSelect'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', updateLiveCalculatorResults);
    });

    const calcBtn = document.getElementById('btnCalculateAndAdd');
    if (calcBtn) calcBtn.addEventListener('click', handleCalculateAndAdd);

    const resetFormBtn = document.getElementById('btnResetForm');
    if (resetFormBtn) {
      resetFormBtn.addEventListener('click', () => {
        document.getElementById('spiCalculatorForm').reset();
        updateLiveCalculatorResults();
        showToast('↺ Form reset');
      });
    }

    const presetPanic = document.getElementById('presetPanic');
    if (presetPanic) presetPanic.addEventListener('click', () => applyPreset('panic'));

    const presetBalanced = document.getElementById('presetBalanced');
    if (presetBalanced) presetBalanced.addEventListener('click', () => applyPreset('balanced'));

    const presetHighYield = document.getElementById('presetHighYield');
    if (presetHighYield) presetHighYield.addEventListener('click', () => applyPreset('highyield'));

    // Masterboard Search & Filters
    const searchInput = document.getElementById('indexSearchInput');
    const clearSearchBtn = document.getElementById('btnClearSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        appState.searchQuery = e.target.value.trim();
        if (clearSearchBtn) clearSearchBtn.classList.toggle('show', appState.searchQuery.length > 0);
        renderMasterboard();
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        appState.searchQuery = '';
        clearSearchBtn.classList.remove('show');
        renderMasterboard();
      });
    }

    document.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        appState.currentFilter = chip.getAttribute('data-filter');
        renderMasterboard();
      });
    });

    const sortSelect = document.getElementById('indexSortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        appState.sortOption = e.target.value;
        renderMasterboard();
      });
    }

    const masterList = document.getElementById('subjectCardList');
    if (masterList) {
      masterList.addEventListener('click', (e) => {
        const toggleBtn = e.target.closest('[data-action="toggle-complete"]');
        if (toggleBtn) {
          const id = toggleBtn.getAttribute('data-id');
          const item = appState.subjects.find(s => s.id === id);
          if (item) {
            item.completed = !item.completed;
            saveSubjects();
            renderMasterboard();
            updateTodaysFocus();
            showToast(item.completed ? `✓ Completed: ${item.topic}` : `Active: ${item.topic}`);
          }
          return;
        }

        const focusBtn = e.target.closest('[data-action="focus-now"]');
        if (focusBtn) {
          const id = focusBtn.getAttribute('data-id');
          appState.currentFocusId = id;
          updateTodaysFocus();
          switchTab('home');
          showToast('🎯 Set as Today\'s Focus Priority');
          return;
        }

        const deleteBtn = e.target.closest('[data-action="delete"]');
        if (deleteBtn) {
          const id = deleteBtn.getAttribute('data-id');
          const item = appState.subjects.find(s => s.id === id);
          if (confirm(`Remove "${item ? item.topic : 'this topic'}"?`)) {
            appState.subjects = appState.subjects.filter(s => s.id !== id);
            saveSubjects();
            renderMasterboard();
            updateTodaysFocus();
            showToast('🗑️ Topic deleted');
          }
        }
      });
    }

    const resetDataBtn = document.getElementById('btnResetToDefaults');
    if (resetDataBtn) {
      resetDataBtn.addEventListener('click', () => {
        if (confirm('Reset to default subjects?')) {
          appState.subjects = JSON.parse(JSON.stringify(DEFAULT_SUBJECTS));
          saveSubjects();
          renderMasterboard();
          updateTodaysFocus();
          showToast('↺ Restored default study dataset');
        }
      });
    }

    const exportBtn = document.getElementById('btnExportJSON');
    if (exportBtn) exportBtn.addEventListener('click', exportStudyPlanJSON);

    // Practice Tab Events
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        appState.practice.activeSubject = btn.getAttribute('data-subject');
        appState.practice.selectedTopic = null;
        renderPractice();
      });
    });

    const chipContainer = document.getElementById('weakTopicsChipContainer');
    if (chipContainer) {
      chipContainer.addEventListener('click', (e) => {
        const pill = e.target.closest('.topic-chip');
        if (pill) {
          const topic = pill.getAttribute('data-topic');
          appState.practice.selectedTopic = appState.practice.selectedTopic === topic ? null : topic;
          renderPractice();
        }
      });
    }

    document.querySelectorAll('.diff-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        appState.practice.activeDifficulty = btn.getAttribute('data-diff');
        renderPractice();
      });
    });

    const qList = document.getElementById('questionListContainer');
    if (qList) {
      qList.addEventListener('click', (e) => {
        const optBtn = e.target.closest('.q-option-btn');
        if (optBtn) {
          const qid = optBtn.getAttribute('data-qid');
          const optIdx = parseInt(optBtn.getAttribute('data-optindex'), 10);
          appState.practice.answers[qid] = optIdx;
          renderPractice();
          return;
        }

        const checkBtn = e.target.closest('[data-action="check-answer"]');
        if (checkBtn) {
          const qid = checkBtn.getAttribute('data-qid');
          const selected = appState.practice.answers[qid];
          if (selected === undefined) {
            showToast('⚠️ Select an option first!', 'warning');
            return;
          }

          let qObj = null;
          Object.values(PRACTICE_REPO).forEach(s => {
            const found = s.questions.find(q => q.id === qid);
            if (found) qObj = found;
          });

          if (qObj) {
            if (selected === qObj.correctIndex) {
              appState.practice.solvedQuestions.add(qid);
              showToast('🎉 Correct answer!');
            } else {
              showToast('❌ Not quite. Revealing solution...', 'warning');
              appState.practice.openSolutions.add(qid);
            }
            renderPractice();
          }
          return;
        }

        const stuckBtn = e.target.closest('[data-action="toggle-solution"]');
        if (stuckBtn) {
          const qid = stuckBtn.getAttribute('data-qid');
          if (appState.practice.openSolutions.has(qid)) {
            appState.practice.openSolutions.delete(qid);
          } else {
            appState.practice.openSolutions.add(qid);
          }
          renderPractice();
        }
      });
    }

    // AI Chatbot Events
    const chatSendBtn = document.getElementById('chatSendBtn');
    if (chatSendBtn) chatSendBtn.addEventListener('click', () => handleChatSubmit());

    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
      chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleChatSubmit();
      });
    }

    document.querySelectorAll('.suggest-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const text = chip.getAttribute('data-prompt');
        if (text) handleChatSubmit(text);
      });
    });
  }

  // -------------------------------------------------------------------------
  // 13. Initialize App
  // -------------------------------------------------------------------------
  function init() {
    initTheme();
    updateTodaysFocus();
    updateLiveCalculatorResults();
    renderMasterboard();
    renderPractice();
    bindEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
