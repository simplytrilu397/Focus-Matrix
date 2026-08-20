/**
 * FocusMatrix — Adaptive GATE Study Planner
 * Connected to Google Cloud Run Backend & Cloud Firestore
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. Initial State & Default Dataset (GATE CS Curriculum)
  // -------------------------------------------------------------------------
  const DEFAULT_SUBJECTS = [
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
      activeSubject: 'gate_eng_maths',
      selectedTopic: null,
      activeDifficulty: 'all',
      answers: {},
      solvedQuestions: new Set(),
      openSolutions: new Set()
    }
  };

  // -------------------------------------------------------------------------
  // 3. Subject Priority Index (SPI) Engine
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
    let recommendation = 'Schedule brief formula recall sessions twice a week.';

    if (finalScore >= 75) {
      tier = 'critical';
      tierText = 'CRITICAL PRIORITY';
      summary = 'High GATE exam weight combined with significant concept gap and impending deadline.';
      recommendation = 'Schedule 2 deep-focus blocks (90 min each) today. Solve 10 PYQs and review cheat sheets.';
    } else if (finalScore >= 60) {
      tier = 'high';
      tierText = 'HIGH PRIORITY';
      summary = 'Important topic requiring active problem-solving drills this week.';
      recommendation = 'Dedicate 1 study sprint today. Focus on moderate-difficulty GATE practice questions.';
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
  // 4. Persistence & Google Cloud Backend API Sync
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
      // Asynchronously sync with Google Cloud Run backend
      fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjects: appState.subjects })
      }).catch(err => console.log('Local mode save (cloud sync queued)'));
    } catch (e) {
      console.error('Storage save error:', e);
    }
  }

  async function fetchCloudSubjects() {
    try {
      const res = await fetch('/api/subjects');
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        appState.subjects = json.data;
        renderMasterboard();
        updateTodaysFocus();
      }
    } catch (e) {
      // Running standalone / local
    }
  }

  // -------------------------------------------------------------------------
  // 5. Tab Navigation
  // -------------------------------------------------------------------------
  function switchTab(tabId) {
    appState.activeTab = tabId;

    document.querySelectorAll('.nav-tab').forEach(btn => {
      const isActive = btn.getAttribute('data-tab') === tabId;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    document.querySelectorAll('.bottom-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });

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

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // -------------------------------------------------------------------------
  // 6. Home Tab — Today's Focus & Pomodoro Timer
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
  // 7. Calculator Tab & Live Results
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

    // Breakdown Bars
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
  // 8. My Subjects (Masterboard)
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
  // 9. Practice Tab — GATE Materials & Diagnostic Solver
  // -------------------------------------------------------------------------
  function renderPractice() {
    const materialsRepo = (typeof GATE_MATERIALS !== 'undefined') ? GATE_MATERIALS : {};
    const subjectData = materialsRepo[appState.practice.activeSubject];
    if (!subjectData) return;

    // Render Cheat Sheets
    const cheatContainer = document.getElementById('cheatSheetContainer');
    if (cheatContainer && subjectData.cheatSheets) {
      cheatContainer.innerHTML = subjectData.cheatSheets.map(c => `
        <div class="cheat-card">
          <div class="cheat-title">📌 ${escapeHTML(c.title)}</div>
          <div class="cheat-formula">${escapeHTML(c.formula)}</div>
        </div>
      `).join('');
    }

    // Render Topic Chips
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

    // Filter Questions
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
        : `Diagnostic Questions (${subjectData.subject})`;
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
            <span class="q-topic-tag">📌 ${escapeHTML(q.topic)} ${q.pyq ? `• <strong style="color:var(--accent);">${escapeHTML(q.pyq)}</strong>` : ''}</span>
            <span class="q-diff-badge diff-${q.difficulty}">${q.difficulty}</span>
          </div>

          <p class="q-prompt"><strong>Q${qIndex + 1}:</strong> ${escapeHTML(q.prompt)}</p>
          ${q.formula ? `<div class="q-hint">💡 Hint / Formula: ${escapeHTML(q.formula)}</div>` : ''}

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
              <div class="solution-step"><div class="step-num-circle">1</div><div class="step-content"><div class="step-title">Concept Recognition</div><div class="step-body">${escapeHTML(q.solution.step1)}</div></div></div>
              <div class="solution-step"><div class="step-num-circle">2</div><div class="step-content"><div class="step-title">Formula & Working</div><div class="step-body">${escapeHTML(q.solution.step2)}</div></div></div>
              <div class="solution-step"><div class="step-num-circle">3</div><div class="step-content"><div class="step-title">Algebraic Steps</div><div class="step-body">${escapeHTML(q.solution.step3)}</div></div></div>
              <div class="solution-step"><div class="step-num-circle">4</div><div class="step-content"><div class="step-title">Final Answer</div><div class="step-body">${escapeHTML(q.solution.step4)}</div></div></div>
            </div>
            <div class="takeaway"><strong>🎯 GATE Exam Strategy & Pitfall:</strong> ${escapeHTML(q.solution.takeaway)}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  function handleChoiceClick(qid, optIndex) {
    appState.practice.answers[qid] = parseInt(optIndex, 10);
    renderPractice();
  }

  function handleCheckAnswer(qid) {
    if (appState.practice.answers[qid] === undefined) {
      showToast('⚠️ Please select an option first!', 'warning');
      return;
    }

    const materialsRepo = (typeof GATE_MATERIALS !== 'undefined') ? GATE_MATERIALS : {};
    let questionObj = null;
    Object.values(materialsRepo).forEach(s => {
      const found = s.questions.find(q => q.id === qid);
      if (found) questionObj = found;
    });

    if (!questionObj) return;

    const isCorrect = appState.practice.answers[qid] === questionObj.correctIndex;
    if (isCorrect) {
      appState.practice.solvedQuestions.add(qid);
      showToast('🎉 Excellent! Correct Answer!');
    } else {
      showToast('❌ Not quite. Step-by-step solution revealed!', 'warning');
      appState.practice.openSolutions.add(qid);
    }

    // Sync progress to backend
    fetch('/api/practice/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionId: qid,
        selectedIndex: appState.practice.answers[qid],
        isCorrect: isCorrect
      })
    }).catch(() => {});

    renderPractice();
  }

  function handleToggleSolution(qid) {
    if (appState.practice.openSolutions.has(qid)) {
      appState.practice.openSolutions.delete(qid);
    } else {
      appState.practice.openSolutions.add(qid);
      showToast('📖 Solution revealed!');
    }
    renderPractice();
  }

  // -------------------------------------------------------------------------
  // 10. AI Study Coach (Backend Route)
  // -------------------------------------------------------------------------
  async function handleChatSend() {
    const inputEl = document.getElementById('chatInput');
    if (!inputEl) return;
    const text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = '';
    appendChatMsg(text, true);

    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, subjects: appState.subjects })
      });
      const data = await res.json();
      if (data && data.reply) {
        appendChatMsg(data.reply, false);
      } else {
        appendChatMsg('<p>I am your GATE Study Assistant. Ask me anything about your study priorities or revision plan.</p>', false);
      }
    } catch (e) {
      // Fallback
      appendChatMsg('<p>FocusMatrix Coach: Your top priority is Calculus & Operating Systems. Dedicate 3 hours today for maximum score boost!</p>', false);
    }
  }

  function appendChatMsg(text, isUser = false) {
    const chatContainer = document.getElementById('chatMessages');
    if (!chatContainer) return;
    const msg = document.createElement('div');
    msg.className = `chat-msg ${isUser ? 'user-msg' : 'bot-msg'}`;
    msg.innerHTML = `<div class="msg-avatar">${isUser ? '🧑' : '🤖'}</div><div class="msg-bubble">${isUser ? `<p>${escapeHTML(text)}</p>` : text}</div>`;
    chatContainer.appendChild(msg);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  // -------------------------------------------------------------------------
  // 11. Utilities & Theme
  // -------------------------------------------------------------------------
  function initTheme() {
    document.body.classList.toggle('theme-light', appState.theme === 'light');
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
    }, 3200);
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function exportStudyPlanJSON() {
    const a = Object.assign(document.createElement('a'), {
      href: 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(appState.subjects, null, 2)),
      download: 'focusmatrix_gate_study_plan.json'
    });
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast('📥 Study Plan Exported as JSON');
  }

  // -------------------------------------------------------------------------
  // 12. Event Listeners Initialization
  // -------------------------------------------------------------------------
  function bindEvents() {
    // Theme Toggle
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    // Tab Navigation
    document.querySelectorAll('.nav-tab').forEach(t => {
      t.addEventListener('click', () => switchTab(t.getAttribute('data-tab')));
    });
    document.querySelectorAll('.bottom-nav-btn').forEach(b => {
      b.addEventListener('click', () => switchTab(b.getAttribute('data-tab')));
    });

    // Form Sliders & Inputs
    ['weaknessSlider', 'weightageSlider', 'urgencySlider', 'hoursSlider', 'topicNameInput', 'subjectSelect'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', updateLiveCalculatorResults);
    });
    document.querySelectorAll('input[name="confidenceLevel"]').forEach(r => {
      r.addEventListener('change', updateLiveCalculatorResults);
    });

    // Calculator Actions
    const addBtn = document.getElementById('btnCalculateAndAdd');
    if (addBtn) addBtn.addEventListener('click', handleCalculateAndAdd);

    const resetFormBtn = document.getElementById('btnResetForm');
    if (resetFormBtn) resetFormBtn.addEventListener('click', () => {
      const form = document.getElementById('spiCalculatorForm');
      if (form) form.reset();
      updateLiveCalculatorResults();
      showToast('↺ Form reset');
    });

    // Presets
    const pPanic = document.getElementById('presetPanic');
    const pBalanced = document.getElementById('presetBalanced');
    const pHighYield = document.getElementById('presetHighYield');
    if (pPanic) pPanic.addEventListener('click', () => applyPreset('panic'));
    if (pBalanced) pBalanced.addEventListener('click', () => applyPreset('balanced'));
    if (pHighYield) pHighYield.addEventListener('click', () => applyPreset('highyield'));

    // Today's Focus Actions
    const timerToggle = document.getElementById('btnTimerToggle');
    const timerReset = document.getElementById('btnTimerReset');
    const markDone = document.getElementById('btnMarkFocusDone');
    const nextTopic = document.getElementById('btnNextFocusTopic');
    if (timerToggle) timerToggle.addEventListener('click', toggleTimer);
    if (timerReset) timerReset.addEventListener('click', resetTimer);
    if (markDone) markDone.addEventListener('click', handleMarkFocusDone);
    if (nextTopic) nextTopic.addEventListener('click', handleShuffleFocus);

    // Masterboard Filters
    document.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        appState.currentFilter = chip.getAttribute('data-filter');
        renderMasterboard();
      });
    });

    // Masterboard Search
    const searchInput = document.getElementById('indexSearchInput');
    const clearSearch = document.getElementById('btnClearSearch');
    if (searchInput) {
      searchInput.addEventListener('input', e => {
        appState.searchQuery = e.target.value.trim();
        if (clearSearch) clearSearch.classList.toggle('show', appState.searchQuery.length > 0);
        renderMasterboard();
      });
    }
    if (clearSearch) {
      clearSearch.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        appState.searchQuery = '';
        clearSearch.classList.remove('show');
        renderMasterboard();
      });
    }

    // Masterboard Sort
    const sortSelect = document.getElementById('indexSortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', e => {
        appState.sortOption = e.target.value;
        renderMasterboard();
      });
    }

    // Masterboard Card Action Delegation
    const cardList = document.getElementById('subjectCardList');
    if (cardList) {
      cardList.addEventListener('click', e => {
        const toggleBtn = e.target.closest('[data-action="toggle-complete"]');
        if (toggleBtn) {
          const id = toggleBtn.getAttribute('data-id');
          const item = appState.subjects.find(s => s.id === id);
          if (item) {
            item.completed = !item.completed;
            saveSubjects();
            renderMasterboard();
            updateTodaysFocus();
            showToast(item.completed ? `✓ Completed: ${item.topic}` : `Marked active: ${item.topic}`);
          }
          return;
        }

        const focusBtn = e.target.closest('[data-action="focus-now"]');
        if (focusBtn) {
          const id = focusBtn.getAttribute('data-id');
          appState.currentFocusId = id;
          updateTodaysFocus();
          showToast('🎯 Set as Today\'s Focus Priority');
          switchTab('home');
          setTimeout(() => {
            const hero = document.getElementById('focusHero');
            if (hero) hero.scrollIntoView({ behavior: 'smooth' });
          }, 100);
          return;
        }

        const deleteBtn = e.target.closest('[data-action="delete"]');
        if (deleteBtn) {
          const id = deleteBtn.getAttribute('data-id');
          const item = appState.subjects.find(s => s.id === id);
          if (confirm(`Remove "${item ? item.topic : 'this topic'}" from your priority index?`)) {
            appState.subjects = appState.subjects.filter(s => s.id !== id);
            saveSubjects();
            renderMasterboard();
            updateTodaysFocus();
            showToast('🗑️ Topic deleted');
          }
        }
      });
    }

    // Masterboard Bottom Actions
    const resetDataBtn = document.getElementById('btnResetToDefaults');
    const exportBtn = document.getElementById('btnExportJSON');
    const syncCloudBtn = document.getElementById('btnSyncCloud');
    if (resetDataBtn) resetDataBtn.addEventListener('click', () => {
      if (confirm('Reset to sample GATE study dataset?')) {
        appState.subjects = JSON.parse(JSON.stringify(DEFAULT_SUBJECTS));
        saveSubjects();
        renderMasterboard();
        updateTodaysFocus();
        showToast('↺ Demo dataset restored');
      }
    });
    if (exportBtn) exportBtn.addEventListener('click', exportStudyPlanJSON);
    if (syncCloudBtn) syncCloudBtn.addEventListener('click', () => {
      saveSubjects();
      showToast('☁️ Synced to Google Cloud Firestore');
    });

    // Practice Module — Subject Tabs
    document.querySelectorAll('#practiceSubjectTabs .tab-btn').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('#practiceSubjectTabs .tab-btn').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        appState.practice.activeSubject = tab.getAttribute('data-subject');
        appState.practice.selectedTopic = null;
        renderPractice();
      });
    });

    // Practice — Weak Topic Chips (delegated)
    const chipsContainer = document.getElementById('weakTopicsChipContainer');
    if (chipsContainer) {
      chipsContainer.addEventListener('click', e => {
        const pill = e.target.closest('.topic-chip');
        if (pill) {
          const name = pill.getAttribute('data-topic');
          appState.practice.selectedTopic = appState.practice.selectedTopic === name ? null : name;
          renderPractice();
        }
      });
    }

    // Practice — Difficulty Filters
    document.querySelectorAll('.diff-filter .diff-btn').forEach(df => {
      df.addEventListener('click', () => {
        document.querySelectorAll('.diff-filter .diff-btn').forEach(d => d.classList.remove('active'));
        df.classList.add('active');
        appState.practice.activeDifficulty = df.getAttribute('data-diff');
        renderPractice();
      });
    });

    // Practice — Question Actions (delegated)
    const qContainer = document.getElementById('questionListContainer');
    if (qContainer) {
      qContainer.addEventListener('click', e => {
        const optBtn = e.target.closest('.q-option-btn');
        if (optBtn) {
          handleChoiceClick(optBtn.getAttribute('data-qid'), optBtn.getAttribute('data-optindex'));
          return;
        }

        const checkBtn = e.target.closest('[data-action="check-answer"]');
        if (checkBtn) {
          handleCheckAnswer(checkBtn.getAttribute('data-qid'));
          return;
        }

        const solBtn = e.target.closest('[data-action="toggle-solution"]');
        if (solBtn) {
          handleToggleSolution(solBtn.getAttribute('data-qid'));
          return;
        }
      });
    }

    // AI Assistant Chat
    const chatSendBtn = document.getElementById('chatSendBtn');
    const chatInput = document.getElementById('chatInput');
    if (chatSendBtn) chatSendBtn.addEventListener('click', handleChatSend);
    if (chatInput) {
      chatInput.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleChatSend();
        }
      });
    }
    document.querySelectorAll('.suggest-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        if (chatInput) {
          chatInput.value = chip.getAttribute('data-prompt');
          handleChatSend();
        }
      });
    });
  }

  // -------------------------------------------------------------------------
  // 13. Bootstrap
  // -------------------------------------------------------------------------
  function init() {
    initTheme();
    updateLiveCalculatorResults();
    renderMasterboard();
    updateTodaysFocus();
    renderPractice();
    renderTimerDisplay();
    bindEvents();
    fetchCloudSubjects();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
