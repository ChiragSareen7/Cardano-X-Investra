// /pages/api/validate-document.js
import { IncomingForm } from 'formidable';
import fs from 'fs';
import axios from 'axios';

// Disable body parser for this route
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Parse form with uploaded file
    const form = new IncomingForm();
    form.keepExtensions = true;

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // Get the file
    const file = files.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Read the file content
    const filePath = file.filepath;
    const fileData = fs.readFileSync(filePath);
    const fileContent = fileData.toString(); // Convert Buffer to string
    
    // For binary files like PDFs and images, we'd need to handle them differently
    // Here we're simplifying and just checking text content
    
    // Extract prediction details from the form
    const predictionText = fields.predictionText || 'No prediction provided';

    // Check if API key is configured
    if (!process.env.PERPLEXITY_API_KEY) {
      console.error('PERPLEXITY_API_KEY not configured');
      return res.status(500).json({
        trustLevel: "unverified",
        score: 30,
        summary: "Document validation service not configured. PERPLEXITY_API_KEY environment variable is required.",
        error: true
      });
    }

    // Send the file content to Perplexity API for validation
    const response = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      {
        model: "sonar", // Using the free tier model
        messages: [{ 
          role: "user", 
          content: `Please analyze if this document supports or contradicts the following financial prediction: "${predictionText}".
                    Document content: "${fileContent.substring(0, 4000)}..." 
                    
                    Analyze the credibility of this document and determine if it's a trusted source, unverified source, or low quality source.
                    Assign a score from 0-100 indicating how much this document supports the prediction.
                    Provide a short summary of your analysis.
                    
                    Format your response as JSON with the following structure:
                    {
                      "trustLevel": "trusted", "unverified", or "low_quality",
                      "score": numerical value from 0-100,
                      "summary": "brief explanation of your assessment"
                    }`
        }]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Extract and parse the response
    const content = response.data.choices[0].message.content;
    let validationResult;
    
    try {
      // Try to parse the JSON response
      validationResult = JSON.parse(content);
    } catch (error) {
      // If JSON parsing fails, create a structured result by extracting info from text
      const textLower = content.toLowerCase();
      
      let trustLevel = "unverified";
      if (textLower.includes("trusted source") || textLower.includes("high quality") || textLower.includes("reliable")) {
        trustLevel = "trusted";
      } else if (textLower.includes("low quality") || textLower.includes("unreliable") || textLower.includes("poor quality")) {
        trustLevel = "low_quality";
      }
      
      // Try to extract a score
      let score = 50; // Default middle score
      const scoreMatch = textLower.match(/score:?\s*(\d+)/i) || textLower.match(/(\d+)\s*\/\s*100/);
      if (scoreMatch && scoreMatch[1]) {
        score = parseInt(scoreMatch[1]);
      }
      
      // Create a summary
      let summary = "Automated analysis of document credibility";
      if (content.length < 200) {
        summary = content;
      } else {
        // Take the first 2 sentences as a summary
        const sentences = content.split(/[.!?]+/);
        if (sentences.length >= 2) {
          summary = sentences.slice(0, 2).join(". ") + ".";
        } else {
          summary = sentences[0] + ".";
        }
      }
      
      validationResult = {
        trustLevel,
        score,
        summary
      };
    }
    
    // Return the validation result
    return res.status(200).json(validationResult);
    
  } catch (error) {
    console.error("Error validating document:", error);
    
    // Provide a fallback validation
    return res.status(200).json({
      trustLevel: "unverified",
      score: 30,
      summary: "Unable to fully analyze this document. Consider providing more relevant supporting documents.",
      error: true
    });
  }
}
