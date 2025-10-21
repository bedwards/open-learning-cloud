export async function handleAnalytics(request, env, user, isScheduled = false) {
  if (isScheduled) {
    // Nightly job - generate analytics
    await generateNightlyAnalytics(env);
    return new Response('Analytics generated', { status: 200 });
  }

  if (request.method === 'GET') {
    // Fetch analytics
    const analytics = await fetchAnalytics(env);
    return new Response(JSON.stringify(analytics), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response('Method not allowed', { status: 405 });
}

async function generateNightlyAnalytics(env) {
  // This would aggregate data from Firestore
  // For demonstration, we'll create sample analytics

  const analytics = {
    date: new Date().toISOString(),
    totalLessons: 42,
    totalUsers: 150,
    hoursWatched: 1250,
    completionRate: 0.68,
    topLessons: [
      { id: 'lesson1', title: 'Introduction to Physics', views: 350 },
      { id: 'lesson2', title: 'World History', views: 280 },
      { id: 'lesson3', title: 'Mathematics Basics', views: 245 },
    ],
  };

  // Store in KV
  await env.METADATA_KV.put('analytics:latest', JSON.stringify(analytics));

  console.log('Nightly analytics generated:', analytics);
}

async function fetchAnalytics(env) {
  const data = await env.METADATA_KV.get('analytics:latest');
  return data ? JSON.parse(data) : null;
}
