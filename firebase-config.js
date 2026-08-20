/**
 * FocusMatrix — Firebase & Google Cloud Client SDK Integration
 * Authentication, Cloud Firestore Real-time Sync & GATE Materials Cloud Pipeline
 */

const FocusFirebase = (function () {
  'use strict';

  // Default / Cached Firebase Config
  const STORAGE_KEY_CONFIG = 'fm_firebase_config_v1';
  
  // Default demo / placeholder config (allows app to run seamlessly even before cloud deploy)
  const defaultFirebaseConfig = {
    apiKey: "AIzaSyDEMO-KEY-FOCUS-MATRIX-2026",
    authDomain: "focusmatrix-gate.firebaseapp.com",
    projectId: "focusmatrix-gate",
    storageBucket: "focusmatrix-gate.appspot.com",
    messagingSenderId: "1029384756",
    appId: "1:1029384756:web:abcd1234efgh5678"
  };

  let config = loadStoredConfig();
  let app = null;
  let auth = null;
  let db = null;
  let currentUser = null;
  let authListeners = [];
  let isInitialized = false;

  function loadStoredConfig() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not parse saved Firebase config', e);
    }
    return defaultFirebaseConfig;
  }

  function saveConfig(newConfig) {
    try {
      config = { ...config, ...newConfig };
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
      initFirebase();
      return true;
    } catch (e) {
      console.error('Failed to save Firebase config:', e);
      return false;
    }
  }

  function initFirebase() {
    try {
      if (typeof firebase !== 'undefined') {
        if (!firebase.apps.length) {
          app = firebase.initializeApp(config);
        } else {
          app = firebase.app();
        }
        auth = firebase.auth();
        db = firebase.firestore();

        // Listen for authentication changes
        auth.onAuthStateChanged((user) => {
          currentUser = user;
          authListeners.forEach(listener => listener(user));
        });

        isInitialized = true;
        console.log('✓ Firebase SDK successfully initialized with project:', config.projectId);
      } else {
        console.warn('Firebase scripts not yet loaded in window. Falling back to local offline mode.');
      }
    } catch (e) {
      console.warn('Firebase initialization error (using simulated/local state):', e.message);
    }
  }

  // -------------------------------------------------------------------------
  // Authentication API
  // -------------------------------------------------------------------------
  async function registerWithEmail(email, password, displayName = '') {
    if (!auth) {
      // Local fallback simulation if Firebase not connected
      return simulateLocalUser(email, displayName || email.split('@')[0]);
    }
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      if (displayName && userCredential.user) {
        await userCredential.user.updateProfile({ displayName });
      }
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async function loginWithEmail(email, password) {
    if (!auth) {
      return simulateLocalUser(email, email.split('@')[0]);
    }
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async function loginWithGoogle() {
    if (!auth) {
      return simulateLocalUser('student@gate.edu', 'GATE Aspirant');
    }
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await auth.signInWithPopup(provider);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async function logout() {
    if (auth) {
      await auth.signOut();
    }
    currentUser = null;
    localStorage.removeItem('fm_simulated_user');
    authListeners.forEach(listener => listener(null));
    return { success: true };
  }

  function simulateLocalUser(email, displayName) {
    const user = {
      uid: 'local_user_' + Date.now(),
      email: email,
      displayName: displayName || 'GATE Student',
      photoURL: null,
      isSimulated: true
    };
    currentUser = user;
    localStorage.setItem('fm_simulated_user', JSON.stringify(user));
    authListeners.forEach(listener => listener(user));
    return { success: true, user };
  }

  function onAuthChange(callback) {
    authListeners.push(callback);
    // Trigger immediately with current user
    if (currentUser) {
      callback(currentUser);
    } else {
      // Check stored simulated user
      const savedUser = localStorage.getItem('fm_simulated_user');
      if (savedUser) {
        try {
          currentUser = JSON.parse(savedUser);
          callback(currentUser);
        } catch (e) {}
      } else {
        callback(null);
      }
    }
  }

  // -------------------------------------------------------------------------
  // Cloud Firestore Database Operations
  // -------------------------------------------------------------------------
  async function syncSubjectsToCloud(userId, subjects) {
    if (!db || !userId) return false;
    try {
      const userRef = db.collection('users').doc(userId);
      await userRef.set({
        lastActive: firebase.firestore.FieldValue.serverTimestamp(),
        totalSubjects: subjects.length
      }, { merge: true });

      const batch = db.batch();
      subjects.forEach(subject => {
        const docRef = userRef.collection('subjects').doc(subject.id);
        batch.set(docRef, subject, { merge: true });
      });
      await batch.commit();
      console.log('✓ Successfully synced subjects to Cloud Firestore');
      return true;
    } catch (error) {
      console.warn('Firestore sync failed:', error.message);
      return false;
    }
  }

  async function fetchSubjectsFromCloud(userId) {
    if (!db || !userId) return null;
    try {
      const snapshot = await db.collection('users').doc(userId).collection('subjects').get();
      if (snapshot.empty) return null;
      const subjects = [];
      snapshot.forEach(doc => subjects.push(doc.data()));
      return subjects;
    } catch (error) {
      console.warn('Error fetching Firestore subjects:', error.message);
      return null;
    }
  }

  async function savePracticeProgress(userId, progressData) {
    if (!db || !userId) return;
    try {
      await db.collection('users').doc(userId).collection('practiceProgress').doc(progressData.questionId).set({
        ...progressData,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    } catch (e) {
      console.warn('Firestore progress save failed:', e.message);
    }
  }

  // Seed GATE study materials into Firestore cloud database
  async function seedGateMaterialsToCloud(materialsObj) {
    if (!db) return false;
    try {
      const batch = db.batch();
      for (const [key, material] of Object.entries(materialsObj)) {
        const matRef = db.collection('gate_materials').doc(key);
        batch.set(matRef, {
          id: material.id,
          subject: material.subject,
          code: material.code,
          weightage: material.weightage,
          description: material.description,
          topics: material.topics,
          cheatSheets: material.cheatSheets
        }, { merge: true });

        material.questions.forEach(q => {
          const qRef = matRef.collection('questions').doc(q.id);
          batch.set(qRef, q, { merge: true });
        });
      }
      await batch.commit();
      console.log('✓ Successfully seeded GATE materials to Cloud Firestore');
      return true;
    } catch (e) {
      console.warn('Firestore GATE materials seeding failed:', e.message);
      return false;
    }
  }

  return {
    init: initFirebase,
    getConfig: () => ({ ...config }),
    saveConfig,
    registerWithEmail,
    loginWithEmail,
    loginWithGoogle,
    logout,
    onAuthChange,
    getCurrentUser: () => currentUser,
    syncSubjectsToCloud,
    fetchSubjectsFromCloud,
    savePracticeProgress,
    seedGateMaterialsToCloud,
    isCloudReady: () => !!(auth && db)
  };
})();

// Auto-initialize on load
if (typeof window !== 'undefined') {
  window.FocusFirebase = FocusFirebase;
  window.addEventListener('DOMContentLoaded', () => {
    FocusFirebase.init();
  });
}
