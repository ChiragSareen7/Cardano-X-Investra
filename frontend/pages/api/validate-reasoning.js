// /pages/api/validate-reasoning.js
import axios from 'axios';
import Groq from "groq-sdk";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { reasoning } = req.body;
    
    if (!reasoning) {
      return res.status(400).json({ error: 'Missing reasoning parameter' });
    }

    // Check if API key is configured
    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY not configured');
      return res.status(500).json({ 
        error: 'AI validation service not configured',
        message: 'GROQ_API_KEY environment variable is required'
      });
    }

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: "openai/gpt-oss-20b",
        messages: [
          { 
            role: "system", 
            content: "You are a financial reasoning validator. Judge if financial reasoning is strong, evidence-based, and logical. Respond with a JSON object containing: isValid (boolean), score (number from 0-100 representing how strong the reasoning is), message (string summary of assessment), details (detailed feedback). The reasoning is valid if it contains specific data points, cites sources, considers multiple perspectives, and makes logical conclusions." 
          },
          { role: "user", content: reasoning }
        ],
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Parse the result from Groq
    const content = response.data.choices[0].message.content;
    const parsedContent = JSON.parse(content);
    
    // If score is not provided, calculate it based on isValid
    if (typeof parsedContent.score !== 'number') {
      parsedContent.score = parsedContent.isValid ? 85 : 40;
    }
    
    return res.status(200).json(parsedContent);
  } catch (error) {
    console.error("Error validating reasoning with Groq:", error.response?.data || error.message);
    
    // Provide a fallback response
    return res.status(200).json({ 
      isValid: false,
      score: 30,
      message: "Unable to fully analyze this reasoning. Consider adding more data points and evidence.",
      details: "The validation service encountered an error, but a preliminary review suggests your reasoning needs more supporting evidence and specific data points to strengthen your prediction. Try including market trends, historical data, and reference to reliable sources."
    });
  }
}
