import { openDB } from 'idb';

const DB_NAME = 'open-learning-sync';
const DB_VERSION = 1;
const PENDING_STORE = 'pending-operations';

let db;
let syncInProgress = false;

export async function initSyncManager() {
  db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(PENDING_STORE)) {
        const store = db.createObjectStore(PENDING_STORE, {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('timestamp', 'timestamp');
        store.createIndex('type', 'type');
      }
    },
  });

  // Listen for online/offline events
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Check if online and sync immediately
  if (navigator.onLine) {
    await syncPendingOperations();
  }
}

async function handleOnline() {
  console.log('Network connection restored');
  await syncPendingOperations();
}

function handleOffline() {
  console.log('Network connection lost');
}

export async function queueOperation(operation) {
  const entry = {
    ...operation,
    timestamp: Date.now(),
    retries: 0,
  };

  const id = await db.add(PENDING_STORE, entry);
  console.log(`Queued operation ${id}:`, operation.type);

  // Try to sync immediately if online
  if (navigator.onLine && !syncInProgress) {
    await syncPendingOperations();
  }

  return id;
}

export async function syncPendingOperations() {
  if (syncInProgress || !navigator.onLine) {
    return;
  }

  syncInProgress = true;

  try {
    const operations = await db.getAllFromIndex(
      PENDING_STORE,
      'timestamp'
    );

    for (const operation of operations) {
      try {
        await executeOperation(operation);
        await db.delete(PENDING_STORE, operation.id);
        console.log(`Synced operation ${operation.id}`);
      } catch (error) {
        console.error(`Failed to sync operation ${operation.id}:`, error);

        // Increment retry count
        operation.retries = (operation.retries || 0) + 1;

        if (operation.retries >= 3) {
          // Max retries reached, remove from queue
          await db.delete(PENDING_STORE, operation.id);
          console.error(`Operation ${operation.id} exceeded max retries`);
        } else {
          // Update retry count
          await db.put(PENDING_STORE, operation);
        }
      }
    }
  } finally {
    syncInProgress = false;
  }
}

async function executeOperation(operation) {
  const { type, data } = operation;

  switch (type) {
    case 'LESSON_CREATE':
      return createLessonOnServer(data);
    case 'LESSON_UPDATE':
      return updateLessonOnServer(data);
    case 'PROGRESS_UPDATE':
      return updateProgressOnServer(data);
    case 'MEDIA_UPLOAD':
      return uploadMediaToR2(data);
    default:
      throw new Error(`Unknown operation type: ${type}`);
  }
}

async function createLessonOnServer(data) {
  const { setDoc, doc } = await import('./firebase.js');
  const { getFirebaseDb } = await import('./firebase.js');

  const db = getFirebaseDb();
  const lessonRef = doc(db, 'lessons', data.id);

  await setDoc(lessonRef, {
    ...data,
    createdAt: new Date().toISOString(),
  });
}

async function updateLessonOnServer(data) {
  const { updateDoc, doc } = await import('./firebase.js');
  const { getFirebaseDb } = await import('./firebase.js');

  const db = getFirebaseDb();
  const lessonRef = doc(db, 'lessons', data.id);

  await updateDoc(lessonRef, {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

async function updateProgressOnServer(data) {
  const { setDoc, doc } = await import('./firebase.js');
  const { getFirebaseDb, getCurrentUser } = await import('./firebase.js');

  const db = getFirebaseDb();
  const user = getCurrentUser();

  if (!user) throw new Error('User not authenticated');

  const progressRef = doc(db, 'progress', `${user.uid}_${data.lessonId}`);

  await setDoc(
    progressRef,
    {
      userId: user.uid,
      lessonId: data.lessonId,
      progress: data.progress,
      completed: data.completed,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

async function uploadMediaToR2(data) {
  const { getCurrentUser } = await import('./firebase.js');
  const user = getCurrentUser();

  if (!user) throw new Error('User not authenticated');

  const token = await user.getIdToken();

  const formData = new FormData();
  formData.append('file', data.file);
  formData.append('metadata', JSON.stringify(data.metadata));

  const response = await fetch(
    'https://open-learning-cloud-worker.your-subdomain.workers.dev/upload',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  return response.json();
}

export async function getPendingOperationsCount() {
  const count = await db.count(PENDING_STORE);
  return count;
}
