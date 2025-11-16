// Next.js API route to proxy prediction creation to backend
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5008';

  try {
    // Add timeout to fetch request (increased to 15 seconds to allow for MongoDB operations)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const response = await fetch(`${backendUrl}/api/dao/predictions/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error proxying to backend:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to connect to backend server';
    if (error.name === 'AbortError') {
      errorMessage = 'Backend server request timed out. Please check if the backend is running.';
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Backend server is not running. Please start it with: cd backend && npm run dev';
    } else if (error.message) {
      errorMessage = `Backend connection error: ${error.message}`;
    }

    return res.status(500).json({
      success: false,
      message: errorMessage,
      error: error.message,
      backendUrl: backendUrl,
      hint: 'Make sure the backend server is running on port 5008'
    });
  }
}

