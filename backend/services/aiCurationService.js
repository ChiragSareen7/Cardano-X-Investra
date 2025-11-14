const axios = require('axios');

class AICurationService {
  constructor() {
    this.groqApiKey = process.env.GROQ_API_KEY || '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';
    this.perplexityApiKey = process.env.PERPLEXITY_API_KEY;
  }

  // Generate comprehensive personalized insights using GROQ AI
  async generatePersonalizedInsights(userProfile) {
    try {
      const insights = await Promise.all([
        this.generateLearningPaths(userProfile),
        this.generateInvestmentRecommendations(userProfile),
        this.generateMarketTrends(userProfile),
        this.generateRiskAlerts(userProfile)
      ]);

      return {
        learningPaths: insights[0],
        investmentRecommendations: insights[1],
        marketTrends: insights[2],
        riskAlerts: insights[3],
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Error generating personalized insights:', error);
      return this.getFallbackInsights(userProfile);
    }
  }

  // Generate personalized learning paths
  async generateLearningPaths(userProfile) {
    try {
      const prompt = `Based on this user profile, create a personalized learning path:
      
      User Profile:
      - Experience Level: ${userProfile.experienceLevel}
      - Areas of Interest: ${userProfile.areasOfInterest.join(', ')}
      - Primary Goal: ${userProfile.primaryGoal}
      - Risk Tolerance: ${userProfile.riskTolerance}
      - Investment Amount: $${userProfile.investmentAmount}
      - Time Horizon: ${userProfile.timeHorizon}
      - Learning Goals: ${userProfile.learningGoals.join(', ')}
      
      Create 3-5 specific learning recommendations that match their experience level and interests. Include:
      1. Specific topics to study
      2. Recommended resources (courses, books, articles)
      3. Practical exercises they can do
      4. Timeline for each learning goal
      
      Format as a JSON array with objects containing: title, description, difficulty, estimatedTime, resources.`;

      const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are an expert financial education advisor. Create personalized learning paths for investors based on their profile. Be specific and actionable.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${this.groqApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return this.parseLearningPaths(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Error generating learning paths:', error);
      return this.getFallbackLearningPaths(userProfile);
    }
  }

  // Generate investment recommendations based on profile
  async generateInvestmentRecommendations(userProfile) {
    try {
      const prompt = `Based on this user profile, provide specific investment recommendations:
      
      User Profile:
      - Investment Amount: $${userProfile.investmentAmount}
      - Risk Tolerance: ${userProfile.riskTolerance}
      - Time Horizon: ${userProfile.timeHorizon}
      - Areas of Interest: ${userProfile.areasOfInterest.join(', ')}
      - Preferred Prediction Types: ${userProfile.preferredPredictionTypes.join(', ')}
      
      Provide 3-5 specific investment recommendations including:
      1. Asset allocation suggestions
      2. Specific stocks/commodities/crypto based on their interests
      3. Risk management strategies
      4. Expected returns and timeframes
      5. Why these recommendations match their profile
      
      Format as a JSON array with objects containing: asset, allocation, reasoning, riskLevel, expectedReturn, timeframe.`;

      const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are a professional investment advisor. Provide specific, personalized investment recommendations based on user profiles. Consider their risk tolerance, investment amount, and interests.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.6
      }, {
        headers: {
          'Authorization': `Bearer ${this.groqApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return this.parseInvestmentRecommendations(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Error generating investment recommendations:', error);
      return this.getFallbackInvestmentRecommendations(userProfile);
    }
  }

  // Get real-time market news using Perplexity API
  async getMarketNews(userProfile) {
    try {
      const query = this.buildNewsQuery(userProfile);
      
      const response = await axios.post('https://api.perplexity.ai/chat/completions', {
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'user',
            content: query
          }
        ],
        max_tokens: 500,
        temperature: 0.2
      }, {
        headers: {
          'Authorization': `Bearer ${this.perplexityApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return this.parseNewsResponse(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Error fetching market news:', error);
      return this.getFallbackNews(userProfile);
    }
  }

  // Generate learning recommendations
  async generateLearningRecommendations(userProfile) {
    try {
      const prompt = `Based on this user profile, suggest 3-5 specific learning topics and resources:
      
      User Profile:
      - Experience Level: ${userProfile.experienceLevel}
      - Areas of Interest: ${userProfile.areasOfInterest.join(', ')}
      - Primary Goal: ${userProfile.primaryGoal}
      - Risk Tolerance: ${userProfile.riskTolerance}
      - Investment Amount: $${userProfile.investmentAmount}
      - Time Horizon: ${userProfile.timeHorizon}
      
      Provide specific, actionable learning recommendations that match their level and interests.`;

      const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are an expert financial educator. Provide specific, actionable learning recommendations tailored to the user\'s experience level and interests.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.6
      }, {
        headers: {
          'Authorization': `Bearer ${this.groqApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return this.parseLearningResponse(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Error generating learning recommendations:', error);
      return this.getFallbackLearningRecommendations(userProfile);
    }
  }

  // Generate risk alerts based on user profile
  async generateRiskAlerts(userProfile) {
    try {
      const prompt = `Analyze potential risks for this investor profile and provide 2-3 specific risk alerts:
      
      User Profile:
      - Risk Tolerance: ${userProfile.riskTolerance}
      - Areas of Interest: ${userProfile.areasOfInterest.join(', ')}
      - Investment Amount: $${userProfile.investmentAmount}
      - Experience Level: ${userProfile.experienceLevel}
      
      Focus on risks specific to their investment interests and risk tolerance level.`;

      const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are a risk management expert. Provide specific, actionable risk alerts tailored to the user\'s investment profile and risk tolerance.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 600,
        temperature: 0.5
      }, {
        headers: {
          'Authorization': `Bearer ${this.groqApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return this.parseRiskAlerts(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Error generating risk alerts:', error);
      return this.getFallbackRiskAlerts(userProfile);
    }
  }

  // Build personalization prompt
  buildPersonalizationPrompt(userProfile) {
    return `Create personalized market insights for this investor:

    Profile:
    - Name: ${userProfile.name}
    - Experience: ${userProfile.experienceLevel}
    - Interests: ${userProfile.areasOfInterest.join(', ')}
    - Goal: ${userProfile.primaryGoal}
    - Risk Tolerance: ${userProfile.riskTolerance}
    - Investment Amount: $${userProfile.investmentAmount}
    - Time Horizon: ${userProfile.timeHorizon}

    Provide:
    1. 2-3 current market trends relevant to their interests
    2. Specific investment opportunities matching their risk profile
    3. Personalized advice based on their goals and experience level

    Format as JSON with keys: marketTrends, opportunities, personalizedAdvice`;
  }

  // Build news query
  buildNewsQuery(userProfile) {
    const interests = userProfile.areasOfInterest.join(' OR ');
    return `Find the latest news and market updates about: ${interests}. Focus on developments that would be relevant for a ${userProfile.experienceLevel} investor with ${userProfile.riskTolerance} risk tolerance. Include recent price movements, regulatory changes, and market sentiment.`;
  }

  // Parse AI responses
  parseAIResponse(content) {
    try {
      // Try to parse as JSON first
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback to text parsing
      return {
        marketTrends: [content.split('\n').filter(line => line.trim()).slice(0, 3)],
        opportunities: ['AI-generated insights available'],
        personalizedAdvice: [content]
      };
    } catch (error) {
      return {
        marketTrends: [content],
        opportunities: ['AI insights generated'],
        personalizedAdvice: [content]
      };
    }
  }

  parseNewsResponse(content) {
    const lines = content.split('\n').filter(line => line.trim());
    return lines.slice(0, 5); // Return top 5 news items
  }

  // Parse learning paths from AI response
  parseLearningPaths(content) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback to text parsing
      const lines = content.split('\n').filter(line => line.trim());
      return lines.slice(0, 5).map((line, index) => ({
        title: `Learning Path ${index + 1}`,
        description: line,
        difficulty: 'intermediate',
        estimatedTime: '2-4 weeks',
        resources: ['Online courses', 'Practice exercises']
      }));
    } catch (error) {
      return this.getFallbackLearningPaths();
    }
  }

  // Parse investment recommendations from AI response
  parseInvestmentRecommendations(content) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback to text parsing
      const lines = content.split('\n').filter(line => line.trim());
      return lines.slice(0, 5).map((line, index) => ({
        asset: `Investment ${index + 1}`,
        allocation: '10-20%',
        reasoning: line,
        riskLevel: 'medium',
        expectedReturn: '8-12%',
        timeframe: '1-2 years'
      }));
    } catch (error) {
      return this.getFallbackInvestmentRecommendations();
    }
  }

  // Fallback learning paths
  getFallbackLearningPaths(userProfile) {
    const basePaths = [
      {
        title: 'Market Fundamentals',
        description: 'Learn basic market concepts and terminology',
        difficulty: userProfile.experienceLevel === 'beginner' ? 'beginner' : 'intermediate',
        estimatedTime: '2-3 weeks',
        resources: ['Investopedia', 'YouTube tutorials', 'Practice with paper trading']
      },
      {
        title: 'Risk Management',
        description: 'Understand portfolio diversification and risk assessment',
        difficulty: 'intermediate',
        estimatedTime: '1-2 weeks',
        resources: ['Risk management courses', 'Portfolio analysis tools']
      },
      {
        title: 'Technical Analysis',
        description: 'Learn chart patterns and technical indicators',
        difficulty: 'intermediate',
        estimatedTime: '3-4 weeks',
        resources: ['Charting platforms', 'Technical analysis books']
      }
    ];

    return basePaths.filter(path => 
      userProfile.areasOfInterest.some(interest => 
        path.title.toLowerCase().includes(interest.toLowerCase()) ||
        path.description.toLowerCase().includes(interest.toLowerCase())
      )
    ).slice(0, 3);
  }

  // Fallback investment recommendations
  getFallbackInvestmentRecommendations(userProfile) {
    const recommendations = [];

    if (userProfile.areasOfInterest.includes('stocks')) {
      recommendations.push({
        asset: 'S&P 500 Index Fund',
        allocation: userProfile.riskTolerance === 'conservative' ? '60%' : '40%',
        reasoning: 'Diversified exposure to large-cap US stocks',
        riskLevel: 'medium',
        expectedReturn: '8-10%',
        timeframe: 'long-term'
      });
    }

    if (userProfile.areasOfInterest.includes('crypto')) {
      recommendations.push({
        asset: 'Bitcoin (BTC)',
        allocation: userProfile.riskTolerance === 'aggressive' ? '20%' : '5%',
        reasoning: 'Leading cryptocurrency with institutional adoption',
        riskLevel: 'high',
        expectedReturn: '15-25%',
        timeframe: 'medium-term'
      });
    }

    if (userProfile.areasOfInterest.includes('commodities')) {
      recommendations.push({
        asset: 'Gold ETF',
        allocation: '10%',
        reasoning: 'Hedge against inflation and market volatility',
        riskLevel: 'low',
        expectedReturn: '3-5%',
        timeframe: 'long-term'
      });
    }

    return recommendations.slice(0, 3);
  }

  parseLearningResponse(content) {
    const lines = content.split('\n').filter(line => line.trim());
    return lines.slice(0, 5); // Return top 5 recommendations
  }

  // DAO AI Analysis - Analyze prediction for community voting
  async analyzePredictionForDAO(predictionData) {
    try {
      const analysis = await Promise.all([
        this.summarizePrediction(predictionData),
        this.getMarketContext(predictionData),
        this.assessPredictionCredibility(predictionData),
        this.getRelatedNews(predictionData)
      ]);

      return {
        summary: analysis[0],
        marketContext: analysis[1],
        credibilityAssessment: analysis[2],
        relatedNews: analysis[3],
        analysisDate: new Date(),
        confidence: this.calculateOverallConfidence(analysis)
      };
    } catch (error) {
      console.error('Error analyzing prediction for DAO:', error);
      return this.getFallbackDAOAnalysis(predictionData);
    }
  }

  // Summarize the prediction
  async summarizePrediction(predictionData) {
    try {
      const prompt = `Analyze and summarize this investment prediction for a DAO community:

      Prediction: ${predictionData.title}
      Description: ${predictionData.description}
      Category: ${predictionData.category}
      Creator: ${predictionData.creator}
      
      Provide a concise summary including:
      1. What the prediction claims
      2. Key assumptions made
      3. Potential risks and opportunities
      4. Market factors to consider
      
      Format as a structured summary with clear sections.`;

      const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are a financial analyst providing objective analysis for DAO community voting. Be neutral, factual, and highlight both opportunities and risks.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.5
      }, {
        headers: {
          'Authorization': `Bearer ${this.groqApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error summarizing prediction:', error);
      return `Summary: ${predictionData.title} - ${predictionData.description}`;
    }
  }

  // Get market context using Perplexity
  async getMarketContext(predictionData) {
    try {
      const query = `Current market conditions and trends for ${predictionData.category} investments, recent news and analysis for ${predictionData.title}`;
      
      const response = await axios.post('https://api.perplexity.ai/chat/completions', {
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'user',
            content: query
          }
        ],
        max_tokens: 800,
        temperature: 0.3
      }, {
        headers: {
          'Authorization': `Bearer ${this.perplexityApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error getting market context:', error);
      return `Market context for ${predictionData.category} - Current trends and conditions relevant to this prediction.`;
    }
  }

  // Assess prediction credibility
  async assessPredictionCredibility(predictionData) {
    try {
      const prompt = `Assess the credibility and reliability of this investment prediction:

      Prediction: ${predictionData.title}
      Description: ${predictionData.description}
      Category: ${predictionData.category}
      
      Evaluate:
      1. Reasonableness of claims
      2. Quality of reasoning provided
      3. Market feasibility
      4. Risk factors
      5. Overall credibility score (1-10)
      
      Provide a structured assessment with specific points.`;

      const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are a financial analyst assessing prediction credibility. Be objective and provide specific reasoning for your assessment.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.4
      }, {
        headers: {
          'Authorization': `Bearer ${this.groqApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error assessing credibility:', error);
      return `Credibility assessment: Analysis of prediction feasibility and market alignment.`;
    }
  }

  // Get related news
  async getRelatedNews(predictionData) {
    try {
      const query = `Latest news and developments related to ${predictionData.title} and ${predictionData.category} market`;
      
      const response = await axios.post('https://api.perplexity.ai/chat/completions', {
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'user',
            content: query
          }
        ],
        max_tokens: 600,
        temperature: 0.3
      }, {
        headers: {
          'Authorization': `Bearer ${this.perplexityApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error getting related news:', error);
      return `Related news: Recent developments in ${predictionData.category} market relevant to this prediction.`;
    }
  }

  // Calculate overall confidence score
  calculateOverallConfidence(analysis) {
    // Simple confidence calculation based on analysis completeness
    let score = 5; // Base score
    
    if (analysis[0] && analysis[0].length > 100) score += 1; // Good summary
    if (analysis[1] && analysis[1].length > 100) score += 1; // Market context
    if (analysis[2] && analysis[2].length > 100) score += 1; // Credibility assessment
    if (analysis[3] && analysis[3].length > 100) score += 1; // Related news
    
    return Math.min(score, 10); // Cap at 10
  }

  // Fallback DAO analysis
  getFallbackDAOAnalysis(predictionData) {
    return {
      summary: `Prediction: ${predictionData.title} - ${predictionData.description}`,
      marketContext: `Market analysis for ${predictionData.category} sector`,
      credibilityAssessment: `Credibility assessment based on market conditions`,
      relatedNews: `Recent news relevant to ${predictionData.category}`,
      analysisDate: new Date(),
      confidence: 6
    };
  }

  parseRiskAlerts(content) {
    const lines = content.split('\n').filter(line => line.trim());
    return lines.slice(0, 3); // Return top 3 risk alerts
  }

  // Fallback methods when AI services are unavailable
  getFallbackInsights(userProfile) {
    return {
      marketTrends: [
        `Current ${userProfile.areasOfInterest[0]} market shows moderate volatility`,
        `Consider ${userProfile.riskTolerance} investment strategies for your portfolio`
      ],
      opportunities: [
        `Diversification opportunities in ${userProfile.areasOfInterest.join(' and ')}`,
        `Long-term growth potential for ${userProfile.primaryGoal} investors`
      ],
      personalizedAdvice: [
        `As a ${userProfile.experienceLevel} investor, focus on building a solid foundation`,
        `Your ${userProfile.riskTolerance} risk tolerance suggests balanced portfolio allocation`
      ]
    };
  }

  getFallbackNews(userProfile) {
    return [
      `Market update: ${userProfile.areasOfInterest[0]} sector showing positive trends`,
      `Investment news: Opportunities in ${userProfile.primaryGoal} strategies`,
      `Market analysis: ${userProfile.riskTolerance} risk approach recommended`
    ];
  }

  getFallbackLearningRecommendations(userProfile) {
    return [
      `Learn about ${userProfile.areasOfInterest[0]} fundamentals`,
      `Understand ${userProfile.riskTolerance} risk management strategies`,
      `Study ${userProfile.primaryGoal} investment approaches`,
      `Explore portfolio diversification techniques`,
      `Master market analysis for ${userProfile.experienceLevel} level`
    ];
  }

  getFallbackRiskAlerts(userProfile) {
    return [
      `Monitor ${userProfile.areasOfInterest[0]} market volatility`,
      `Consider risk management for ${userProfile.riskTolerance} investments`,
      `Stay informed about market changes affecting your portfolio`
    ];
  }

  // Main curation method that combines all AI services
  async curateContentForUser(userProfile) {
    try {
      const [insights, news, learning, risks] = await Promise.all([
        this.generatePersonalizedInsights(userProfile),
        this.getMarketNews(userProfile),
        this.generateLearningRecommendations(userProfile),
        this.generateRiskAlerts(userProfile)
      ]);

      return {
        lastUpdated: new Date(),
        marketTrends: insights.marketTrends || [],
        personalizedNews: news || [],
        riskAlerts: risks || [],
        learningRecommendations: learning || [],
        personalizedAdvice: insights.personalizedAdvice || []
      };
    } catch (error) {
      console.error('Error curating content:', error);
      return {
        lastUpdated: new Date(),
        marketTrends: this.getFallbackInsights(userProfile).marketTrends,
        personalizedNews: this.getFallbackNews(userProfile),
        riskAlerts: this.getFallbackRiskAlerts(userProfile),
        learningRecommendations: this.getFallbackLearningRecommendations(userProfile),
        personalizedAdvice: this.getFallbackInsights(userProfile).personalizedAdvice
      };
    }
  }
}

module.exports = new AICurationService();
