export async function verifyFirebaseToken(token, env) {
  try {
    // In production, verify the Firebase token using Firebase Admin SDK
    // For now, we'll do a simple validation

    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${env.FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: token }),
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.users[0];
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}
