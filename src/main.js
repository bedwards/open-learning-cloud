import './styles/main.css';
import { initializeFirebase } from './services/firebase.js';
import { registerServiceWorker } from './services/service-worker-registration.js';
import { initSyncManager } from './services/sync.js';
import { router } from './services/router.js';

// Import web components
import './components/user-profile.js';
import './components/lesson-viewer.js';
import './components/lesson-editor.js';
import './components/analytics-dashboard.js';

async function initApp() {
  try {
    // Initialize Firebase
    await initializeFirebase();
    console.log('Firebase initialized');

    // Register service worker for offline support
    await registerServiceWorker();
    console.log('Service worker registered');

    // Initialize sync manager
    await initSyncManager();
    console.log('Sync manager initialized');

    // Initialize router
    router.init();
    console.log('Router initialized');

    // Show app content
    document.getElementById('app').classList.add('loaded');
  } catch (error) {
    console.error('Failed to initialize app:', error);
    showError('Failed to load application. Please refresh the page.');
  }
}

function showError(message) {
  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="error-message">
      <h2>Error</h2>
      <p>${message}</p>
      <button onclick="window.location.reload()">Reload</button>
    </div>
  `;
}

// Start the app
initApp();
