export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5008';

  try {
    const response = await fetch(`${backendUrl}/api/dao/verification/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body)
    });

    const result = await response.json();
    res.status(response.status).json(result);
  } catch (error) {
    console.error('Error forwarding AI verification to backend:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal Server Error',
      error: error.message 
    });
  }
}
