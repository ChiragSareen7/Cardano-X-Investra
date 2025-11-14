export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5008';
      
      // Forward the request to the backend
      const response = await fetch(`${backendUrl}/api/predictions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body)
      });

      const result = await response.json();
      
      if (response.ok) {
        res.status(200).json(result);
      } else {
        res.status(response.status).json(result);
      }
    } catch (error) {
      console.error('Error in prediction-data API:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  } else if (req.method === 'GET') {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5008';
      
      // Forward the request to the backend
      const response = await fetch(`${backendUrl}/api/predictions?${new URLSearchParams(req.query)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();
      
      if (response.ok) {
        res.status(200).json(result);
      } else {
        res.status(response.status).json(result);
      }
    } catch (error) {
      console.error('Error in prediction-data API:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
