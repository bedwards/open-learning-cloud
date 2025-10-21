import { getCurrentUser } from './firebase.js';

const WORKER_URL =
  import.meta.env.VITE_WORKER_URL ||
  'https://open-learning-cloud-worker.your-subdomain.workers.dev';

export async function uploadMedia(file, metadata = {}) {
  const user = getCurrentUser();

  if (!user) {
    throw new Error('Must be authenticated to upload media');
  }

  const token = await user.getIdToken();

  const formData = new FormData();
  formData.append('file', file);
  formData.append('metadata', JSON.stringify(metadata));

  const response = await fetch(`${WORKER_URL}/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Upload failed');
  }

  return response.json();
}

export async function getMediaUrl(key) {
  const user = getCurrentUser();

  if (!user) {
    throw new Error('Must be authenticated to access media');
  }

  const token = await user.getIdToken();

  const response = await fetch(`${WORKER_URL}/media/${key}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get media URL');
  }

  const data = await response.json();
  return data.url;
}

export async function deleteMedia(key) {
  const user = getCurrentUser();

  if (!user) {
    throw new Error('Must be authenticated to delete media');
  }

  const token = await user.getIdToken();

  const response = await fetch(`${WORKER_URL}/media/${key}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete media');
  }

  return response.json();
}
