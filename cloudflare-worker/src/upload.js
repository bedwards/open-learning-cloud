export async function handleUpload(request, env, user) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const metadataStr = formData.get('metadata');
    const metadata = metadataStr ? JSON.parse(metadataStr) : {};

    if (!file) {
      return new Response('No file provided', { status: 400 });
    }

    // Generate unique key
    const timestamp = Date.now();
    const key = `${user.uid}/${timestamp}_${file.name}`;

    // Upload to R2
    await env.MEDIA_BUCKET.put(key, file.stream(), {
      httpMetadata: {
        contentType: file.type,
      },
      customMetadata: {
        userId: user.uid,
        uploadedAt: new Date().toISOString(),
        ...metadata,
      },
    });

    // Store metadata in KV
    await env.METADATA_KV.put(
      key,
      JSON.stringify({
        name: file.name,
        type: file.type,
        size: file.size,
        userId: user.uid,
        uploadedAt: new Date().toISOString(),
        ...metadata,
      })
    );

    return new Response(
      JSON.stringify({
        success: true,
        key,
        url: `/media/${key}`,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return new Response('Upload failed', { status: 500 });
  }
}
