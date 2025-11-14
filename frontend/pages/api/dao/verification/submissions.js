export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5008';

  try {
    const response = await fetch(`${backendUrl}/api/dao/verification/submissions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const result = await response.json();
    res.status(response.status).json(result);
  } catch (error) {
    console.error('Error fetching verification submissions from backend:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal Server Error',
      error: error.message 
    });
  }
}
