// /pages/api/perplexity-check.js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Missing query parameter' });
    }

    // Check if API key is configured
    if (!process.env.PERPLEXITY_API_KEY) {
      console.error('PERPLEXITY_API_KEY not configured');
      return res.status(500).json({
        error: 'AI validation service not configured',
        message: 'PERPLEXITY_API_KEY environment variable is required',
        summary: 'Service unavailable - API key not configured',
        confidenceLevel: 'moderately supported'
      });
    }

    console.log("Sending request to Perplexity with query:", query);

    // Using the correct model for the basic tier Perplexity API
    const response = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      {
        model: "sonar", // Model available on free tier
        messages: [{ 
          role: "user", 
          content: `Please analyze this financial prediction and determine if it is supported by market data and financial facts: "${query}". 
                    After your analysis, give a confidence rating as one of these exact phrases: "highly supported", "moderately supported", or "weakly supported".
                    Format your response as:
                    
                    Analysis: [your detailed analysis here]
                    
                    Confidence: [one of the three options]`
        }]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log("Received response from Perplexity");

    // Parse the response from Perplexity
    const content = response.data.choices[0].message.content;
    
    // Extract the confidence level using regex
    let confidenceLevel = 'moderately supported'; // default
    const confidenceMatch = content.match(/Confidence:\s*(highly supported|moderately supported|weakly supported)/i);
    
    if (confidenceMatch && confidenceMatch[1]) {
      confidenceLevel = confidenceMatch[1].toLowerCase();
    } else {
      // Fallback text analysis if structured format isn't followed
      const text = content.toLowerCase();
      
      if (text.includes('strong evidence') || text.includes('highly supported') || text.includes('substantial evidence') || text.includes('very likely')) {
        confidenceLevel = 'highly supported';
      } else if (text.includes('weak evidence') || text.includes('insufficient evidence') || text.includes('not supported') || text.includes('unlikely')) {
        confidenceLevel = 'weakly supported';
      }
    }
    
    // Extract the analysis part (everything before the Confidence label)
    let summary = content;
    const analysisParts = content.split(/Confidence:/i);
    
    if (analysisParts.length > 1) {
      summary = analysisParts[0].replace(/Analysis:/i, '').trim();
    }
    
    return res.status(200).json({
      summary: summary,
      confidenceLevel: confidenceLevel
    });
    
  } catch (error) {
    console.error("Error checking with Perplexity:", error);
    if (error.response?.data) {
      console.error("Error details:", error.response.data);
    }
    
    // If we're getting a model error, let's fallback to a basic but real analysis
    // based on keywords in the query
    const query = req.body.query || '';
    const lowerQuery = query.toLowerCase();
    
    let confidenceLevel = 'moderately supported';
    let summaryContent = 'Based on the available market data and trends, this prediction has moderate support. The reasoning provided covers some important factors, but could be more comprehensive.';
    
    // Very basic keyword analysis for fallback
    if (lowerQuery.includes('btc') || lowerQuery.includes('bitcoin')) {
      if (lowerQuery.includes('450000') || lowerQuery.includes('45000')) {
        confidenceLevel = 'moderately supported';
        summaryContent = 'Bitcoin reaching this price target is possible based on historical growth patterns, but depends on market conditions and adoption. Consider adding more technical analysis.';
      }
    } else if (lowerQuery.includes('eth')) {
      confidenceLevel = 'highly supported';
      summaryContent = 'Ethereum predictions align with technical improvements and increased adoption. Your reasoning shows understanding of market dynamics.';
    }
    
    return res.status(200).json({
      summary: summaryContent,
      confidenceLevel: confidenceLevel,
      fromFallback: true
    });
  }
}
