import { verifyFirebaseToken } from './auth.js';
import { handleUpload } from './upload.js';
import { handleAnalytics } from './analytics.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Verify authentication
      const authHeader = request.headers.get('Authorization');
      if (!authHeader) {
        return new Response('Unauthorized', { status: 401 });
      }

      const token = authHeader.replace('Bearer ', '');
      const user = await verifyFirebaseToken(token, env);

      if (!user) {
        return new Response('Invalid token', { status: 401 });
      }

      // Route handling
      if (url.pathname.startsWith('/upload')) {
        return handleUpload(request, env, user);
      }

      if (url.pathname.startsWith('/media/')) {
        return handleMediaAccess(request, env, user, url);
      }

      if (url.pathname.startsWith('/analytics/')) {
        return handleAnalytics(request, env, user);
      }

      return new Response('Not found', { status: 404, headers: corsHeaders });
    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Internal server error', {
        status: 500,
        headers: corsHeaders,
      });
    }
  },

  async scheduled(event, env, ctx) {
    // Nightly analytics job
    console.log('Running scheduled analytics job');
    await handleAnalytics(null, env, null, true);
  },
};

async function handleMediaAccess(request, env, user, url) {
  const key = url.pathname.replace('/media/', '');

  try {
    const object = await env.MEDIA_BUCKET.get(key);

    if (!object) {
      return new Response('Media not found', { status: 404 });
    }

    // Generate signed URL valid for 1 hour
    const signedUrl = await env.MEDIA_BUCKET.createSignedUrl(key, {
      expiresIn: 3600,
    });

    return new Response(JSON.stringify({ url: signedUrl }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Media access error:', error);
    return new Response('Failed to access media', { status: 500 });
  }
}
