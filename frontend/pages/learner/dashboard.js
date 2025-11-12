import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, Sun, Moon, Wallet, Bell, Search, Check, Clock, X, ChevronDown, Share2, Calendar, Home, Compass, BookOpen, User, Eye, Coins } from "lucide-react";
import { useTheme } from 'next-themes';
import Navbar from '@/components/layout/Navbar';
import Head from 'next/head';
import axios from 'axios';
import TokenEnabledPredictionCard from '@/components/ui/TokenEnabledPredictionCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import communityPredictions from './communityPredictions.json';

export default function Dashboard() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [walletAddress, setWalletAddress] = useState("");
  
  const [userName, setUserName] = useState("User");
  const [livePredictions, setLivePredictions] = useState([]);
  const [aiInsights, setAiInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userTokens, setUserTokens] = useState(null);
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [showPredictionDetails, setShowPredictionDetails] = useState(false);

  // Handle theme mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  const darkMode = theme === 'dark';

// Fetch live predictions and AI insights (demo mode)
const fetchLivePredictionsAndInsights = async (walletAddress, profileData) => {
  try {
    // Use static predictions data for demo
    setLivePredictions(communityPredictions);
    
    // Generate demo AI insights based on profile
    const demoInsights = {
      learningPaths: [
        {
          title: "Market Fundamentals",
          description: "Learn basic market concepts and terminology",
          difficulty: profileData?.experienceLevel === 'beginner' ? 'beginner' : 'intermediate',
          estimatedTime: '2-3 weeks',
          resources: ['Investopedia', 'YouTube tutorials', 'Practice with paper trading']
        },
        {
          title: "Risk Management",
          description: "Understand portfolio diversification and risk assessment",
          difficulty: 'intermediate',
          estimatedTime: '1-2 weeks',
          resources: ['Risk management courses', 'Portfolio analysis tools']
        }
      ],
      investmentRecommendations: [
        {
          asset: 'S&P 500 Index Fund',
          allocation: profileData?.riskTolerance === 'conservative' ? '60%' : '40%',
          reasoning: 'Diversified exposure to large-cap US stocks',
          riskLevel: 'medium',
          expectedReturn: '8-10%',
          timeframe: 'long-term'
        },
        {
          asset: 'Bitcoin (BTC)',
          allocation: profileData?.riskTolerance === 'aggressive' ? '20%' : '5%',
          reasoning: 'Leading cryptocurrency with institutional adoption',
          riskLevel: 'high',
          expectedReturn: '15-25%',
          timeframe: 'medium-term'
        }
      ],
      marketTrends: [
        'AI and technology stocks showing strong momentum',
        'Energy sector benefiting from global demand',
        'Healthcare innovation driving sector growth'
      ],
      riskAlerts: [
        'Market volatility expected due to economic uncertainty',
        'Interest rate changes may affect bond prices',
        'Geopolitical tensions impacting global markets'
      ],
      lastUpdated: new Date()
    };
    
    setAiInsights(demoInsights);
  } catch (error) {
    console.error("Error fetching predictions and insights:", error);
    // Fallback to static data
    setLivePredictions(communityPredictions);
  }
};

// Fetch user profile from localStorage (demo mode)
const fetchUserProfile = async () => {
  try {
    const walletAddress = localStorage.getItem('connectedWalletAddress');
    if (walletAddress) {
      setWalletAddress(walletAddress);
      
      // Get profile data from localStorage
      const savedData = localStorage.getItem('inverstraUserProfile');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (parsedData.name) {
          setUserName(parsedData.name);
          // Fetch live predictions and AI insights
          await fetchLivePredictionsAndInsights(walletAddress, parsedData);
        }
      } else {
        // Set default name if no data available
        setUserName("Demo User");
      }
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    // Set default name if no data available
    setUserName("Demo User");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchUserProfile();
}, []);

  useEffect(() => {
    const connectedWallet = localStorage.getItem('connectedWalletAddress');
    if (connectedWallet) {
      setWalletAddress(connectedWallet);
      fetchUserProfile();
      generateDemoTokens();
    } else {
     
      const dummyAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";
      localStorage.setItem('connectedWalletAddress', dummyAddress);
      localStorage.setItem('userRole', 'learner'); // Set default role
      setWalletAddress(dummyAddress);
      fetchUserProfile();
      generateDemoTokens();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Generate demo user tokens
  const generateDemoTokens = () => {
    const walletAddress = localStorage.getItem('connectedWalletAddress');
    const userRole = localStorage.getItem('userRole') || 'learner';
    
    const demoTokens = {
      walletAddress: walletAddress,
      userType: userRole,
      totalTokens: userRole === 'learner' ? 20 : userRole === 'influencer' ? 50 : 30,
      availableTokens: userRole === 'learner' ? 20 : userRole === 'influencer' ? 50 : 30,
      lockedTokens: 0,
      tokenCategories: {
        viewing: userRole === 'learner' ? 20 : 0,
        voting: userRole === 'dao_member' ? 30 : 0,
        creation: userRole === 'influencer' ? 50 : 0,
        bonus: 0
      },
      level: 1,
      reputation: 0,
      badges: [
        {
          name: "Welcome Bonus",
          description: "Received initial tokens for joining",
          earnedAt: new Date(),
          tokenReward: userRole === 'learner' ? 20 : userRole === 'influencer' ? 50 : 30
        }
      ],
      lastTransactionDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setUserTokens(demoTokens);
  };

  // Handle prediction viewing with token updates
  const handleViewPrediction = (prediction) => {
    setSelectedPrediction(prediction);
    setShowPredictionDetails(true);
    
    // Update tokens after viewing (simulate spending 2 tokens)
    if (userTokens && userTokens.availableTokens >= 2) {
      const updatedTokens = {
        ...userTokens,
        availableTokens: userTokens.availableTokens - 2,
        totalTokens: userTokens.totalTokens - 2
      };
      setUserTokens(updatedTokens);
      localStorage.setItem('userTokens', JSON.stringify(updatedTokens));
    }
  };

  // Update user tokens function (for global access)
  useEffect(() => {
    // eslint-disable-next-line no-undef
    window.updateUserTokens = setUserTokens;
    return () => {
      // eslint-disable-next-line no-undef
      delete window.updateUserTokens;
    };
  }, []);

  // to filter predictions that have 70% more yes than no votes
  const filteredPredictions = livePredictions.filter(pred => {
    const totalVotes = pred.votes.yes + pred.votes.no;
    const yesPercentage = (pred.votes.yes / totalVotes) * 100;
    const noPercentage = (pred.votes.no / totalVotes) * 100;
    return yesPercentage > noPercentage;
  });

  const ConfidenceDisplay = ({ level }) => {
    return (
      <div className="flex items-center">
        <div className="flex">
          {Array(level).fill(0).map((_, i) => (
            <span key={i} className="text-yellow-400">★</span>
          ))}
          {Array(5 - level).fill(0).map((_, i) => (
            <span key={i} className="text-gray-600">★</span>
          ))}
        </div>
        <span className="ml-2 text-yellow-400">Confidence</span>
      </div>
    );
  };

  const getCategoryGradient = (category) => {
    const gradients = {
      "Equities": "from-blue-900 to-cyan-900",
      "Crypto": "from-purple-900 to-indigo-900",
      "Commodities": "from-pink-800 to-orange-900",
      "Forex": "from-green-900 to-emerald-900",
      "default": "from-gray-900 to-gray-800"
    };
    
    return gradients[category] || gradients.default;
  };

  const getCategoryTextColor = (category) => {
    const colors = {
      "Equities": "text-cyan-400",
      "Crypto": "text-purple-400",
      "Commodities": "text-amber-400",
      "Forex": "text-emerald-400",
      "default": "text-gray-400"
    };
    
    return colors[category] || colors.default;
  };

  const getHoverGlowColor = (category) => {
    const glows = {
      "Equities": "group-hover:shadow-cyan-500/50",
      "Crypto": "group-hover:shadow-purple-500/50",
      "Commodities": "group-hover:shadow-amber-500/50",
      "Forex": "group-hover:shadow-emerald-500/50",
      "default": "group-hover:shadow-white/20"
    };
    
    return glows[category] || glows.default;
  };

  const PredictionCard = ({ prediction }) => {
    const categoryColor = getCategoryTextColor(prediction.category);
    const categoryGradient = getCategoryGradient(prediction.category);
    const hoverGlow = getHoverGlowColor(prediction.category);
    
    const isConfirmed = prediction.confirmed || prediction.status === "confirmed";
    
    const statusDisplay = isConfirmed ? (
      <div className="flex items-center text-green-400 text-sm">
        <Check size={14} className="mr-1" />
        <span>Verified</span>
      </div>
    ) : (
      <div className="px-3 py-1 bg-amber-900/30 text-amber-500 text-xs font-medium rounded-md">
        Pending Verification
      </div>
    );

    const displayText = prediction.predictionText || 
      (prediction.predictionType === "priceTarget" ? 
      `will reach ${prediction.targetPrice}` : 
      "will perform as predicted");

    const assetName = prediction.asset;
    
    const reasoningText = prediction.reasoning;

    const difficultyLevel = prediction.difficulty || "Medium";

    const timeFrame = prediction.timeFrame || (() => {
      const deadline = new Date(prediction.deadline);
      const today = new Date();
      const diffDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 7) return "Short-term";
      if (diffDays <= 30) return "Mid-term";
      return "Long-term";
    })();

    return (
      <div className={`bg-gradient-to-br ${categoryGradient} rounded-xl border border-gray-800 mb-6 overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-[0_0_15px_rgba(0,0,0,0.3)] ${hoverGlow}`}>
        {/* Header */}
        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center">
           
            <div className="h-10 w-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center mr-3 text-white font-bold">
              {prediction.creatorName ? prediction.creatorName.charAt(0) : "?"}
            </div>
            <div>
              <div className="flex items-center">
                <h3 className="font-bold text-white mr-1">{prediction.creatorName}</h3>
                {(prediction.verified || isConfirmed) && (
                  <span className="text-xs bg-gradient-to-r from-purple-600 to-pink-500 px-2 py-0.5 rounded text-white ml-1">
                    Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400">
                {prediction.creatorTitle || prediction.community || "Community Member"}
              </p>
            </div>
          </div>
          <div className={categoryColor}>
            {prediction.category}
          </div>
        </div>
        
        {/* Prediction */}
        <div className="px-4 pt-2 pb-4">
          <h2 className="text-xl font-bold">
            <span className="text-white">{assetName}</span>{" "}
            <span className={categoryColor}>{displayText}</span>
          </h2>
          
          <div className="flex items-center mt-2 mb-3">
            <Calendar size={16} className="text-gray-500 mr-1" />
            <span className="text-sm text-gray-400">By {new Date(prediction.deadline).toLocaleDateString()}</span>
          </div>
          
          <div className="mt-2 mb-4">
            <ConfidenceDisplay level={prediction.confidence} />
          </div>
          
          <p className="text-gray-300 bg-black/30 backdrop-blur-sm p-3 rounded-lg text-sm mt-2 mb-3 group-hover:bg-black/40 transition-all">
            {reasoningText}
          </p>
        </div>
        
        {/* Footer with actions */}
        <div className="border-t border-gray-800/50 px-4 py-3 flex justify-between items-center">
          <div className="flex space-x-4">
            <div className="flex items-center text-gray-400 hover:text-white cursor-pointer transition-colors">
              <Share2 size={18} />
              <span className="ml-1 text-sm">Share</span>
            </div>
            <div className="text-sm text-gray-500">{timeFrame}</div>
          </div>
          {/* <div className="flex items-center space-x-2">
            <span className="text-sm text-purple-400">Difficulty:</span>
            <span className="text-sm text-gray-300">{difficultyLevel}</span>
          </div> */}
        </div>
        
        {!isConfirmed && (
          <div className="bg-amber-900/30 text-amber-500 text-center py-1 text-sm">
            Pending Verification
          </div>
        )}
      </div>
    );
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#1A132F] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-[#1A132F] text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <Head>
        <title>Learner Dashboard | Inverstra</title>
        <meta name="description" content="View investment predictions and manage your learning journey" />
      </Head>
      
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 mt-20">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2">
            {/* Welcome Block */}
            <div className="mb-8">
              <div>
                <h1 className={`text-3xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  👋 Welcome back, {userName}!
                </h1>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Here's what's trending in your network today.
                </p>
              </div>
            </div>
            
            {loading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                <span className="ml-2 text-gray-400">Loading your personalized insights...</span>
              </div>
            )}
            
            {/* AI Insights Section */}
            {aiInsights && (
              <div className="mb-8">
                <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  🤖 AI Insights for You
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Learning Paths */}
                  {aiInsights.learningPaths && aiInsights.learningPaths.length > 0 && (
                    <div className={`rounded-xl border p-4 transition-colors ${
                      darkMode 
                        ? 'bg-gradient-to-br from-green-900/30 to-teal-900/30 border-green-500/20' 
                        : 'bg-gradient-to-br from-green-50 to-teal-50 border-green-200'
                    }`}>
                      <h3 className={`font-semibold mb-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                        📚 Personalized Learning Paths
                      </h3>
                      <div className="space-y-3">
                        {aiInsights.learningPaths.slice(0, 2).map((path, index) => (
                          <div key={index} className="text-sm">
                            <div className={`font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {path.title}
                            </div>
                            <div className={`mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {path.description}
                            </div>
                            <div className={`flex justify-between text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              <span>⏱️ {path.estimatedTime}</span>
                              <span className={`px-2 py-1 rounded ${
                                path.difficulty === 'beginner' ? 
                                  (darkMode ? 'bg-green-600/20 text-green-400' : 'bg-green-100 text-green-700') :
                                path.difficulty === 'intermediate' ? 
                                  (darkMode ? 'bg-yellow-600/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700') :
                                  (darkMode ? 'bg-red-600/20 text-red-400' : 'bg-red-100 text-red-700')
                              }`}>
                                {path.difficulty}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Investment Recommendations */}
                  {aiInsights.investmentRecommendations && aiInsights.investmentRecommendations.length > 0 && (
                    <div className={`rounded-xl border p-4 transition-colors ${
                      darkMode 
                        ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-500/20' 
                        : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'
                    }`}>
                      <h3 className={`font-semibold mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        💰 Investment Recommendations
                      </h3>
                      <div className="space-y-3">
                        {aiInsights.investmentRecommendations.slice(0, 2).map((rec, index) => (
                          <div key={index} className="text-sm">
                            <div className={`font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {rec.asset}
                            </div>
                            <div className={`mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {rec.reasoning}
                            </div>
                            <div className={`flex justify-between text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              <span>📊 {rec.allocation}</span>
                              <span>📈 {rec.expectedReturn}</span>
                              <span className={`px-2 py-1 rounded ${
                                rec.riskLevel === 'low' ? 
                                  (darkMode ? 'bg-green-600/20 text-green-400' : 'bg-green-100 text-green-700') :
                                rec.riskLevel === 'medium' ? 
                                  (darkMode ? 'bg-yellow-600/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700') :
                                  (darkMode ? 'bg-red-600/20 text-red-400' : 'bg-red-100 text-red-700')
                              }`}>
                                {rec.riskLevel}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Market Trends */}
                  {aiInsights.marketTrends && aiInsights.marketTrends.length > 0 && (
                    <div className={`rounded-xl border p-4 transition-colors ${
                      darkMode 
                        ? 'bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/20' 
                        : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'
                    }`}>
                      <h3 className={`font-semibold mb-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                        📈 Market Trends
                      </h3>
                      <div className="space-y-2">
                        {aiInsights.marketTrends.slice(0, 2).map((trend, index) => (
                          <div key={index} className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {trend}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Risk Alerts */}
                  {aiInsights.riskAlerts && aiInsights.riskAlerts.length > 0 && (
                    <div className={`rounded-xl border p-4 transition-colors ${
                      darkMode 
                        ? 'bg-gradient-to-br from-red-900/30 to-orange-900/30 border-red-500/20' 
                        : 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200'
                    }`}>
                      <h3 className={`font-semibold mb-2 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                        ⚠️ Risk Alerts
                      </h3>
                      <div className="space-y-2">
                        {aiInsights.riskAlerts.slice(0, 2).map((alert, index) => (
                          <div key={index} className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {alert}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Recent Predictions (Instagram-style) */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Live Predictions (DAO Approved)
                </h2>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setActiveFilter("All")}
                    className={`text-xs px-4 py-2 rounded-full transition-all duration-200 font-medium ${
                      activeFilter === "All" 
                        ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg" 
                        : darkMode 
                          ? "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300" 
                          : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800 border border-gray-200 shadow-sm"
                    }`}
                  >
                    All
                  </button>
                  <button 
                    onClick={() => setActiveFilter("Equities")}
                    className={`text-xs px-4 py-2 rounded-full transition-all duration-200 font-medium ${
                      activeFilter === "Equities" 
                        ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg" 
                        : darkMode 
                          ? "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300" 
                          : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800 border border-gray-200 shadow-sm"
                    }`}
                  >
                    Stocks
                  </button>
                  <button 
                    onClick={() => setActiveFilter("Crypto")}
                    className={`text-xs px-4 py-2 rounded-full transition-all duration-200 font-medium ${
                      activeFilter === "Crypto" 
                        ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg" 
                        : darkMode 
                          ? "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300" 
                          : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800 border border-gray-200 shadow-sm"
                    }`}
                  >
                    Crypto
                  </button>
                  <button 
                    onClick={() => setActiveFilter("Commodities")}
                    className={`text-xs px-4 py-2 rounded-full transition-all duration-200 font-medium ${
                      activeFilter === "Commodities" 
                        ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg" 
                        : darkMode 
                          ? "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300" 
                          : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800 border border-gray-200 shadow-sm"
                    }`}
                  >
                    Commodities
                  </button>
                </div>
              </div>
              
              <div className="space-y-6">
                {filteredPredictions
                  .filter(pred => activeFilter === "All" || pred.category === activeFilter)
                  .map(prediction => (
                    <TokenEnabledPredictionCard 
                      key={prediction.id} 
                      prediction={prediction} 
                      userTokens={userTokens}
                      onViewPrediction={handleViewPrediction}
                    />
                  ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              {/* AI Recommendations */}
              <div className={`rounded-xl p-5 border mb-6 transition-colors ${
                darkMode 
                  ? 'bg-gray-900 border-gray-800' 
                  : 'bg-white border-gray-200 shadow-sm'
              }`}>
                <h2 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  AI Recommendations
                </h2>
                <div className="space-y-4">
                  <div className={`p-3 rounded-lg transition-all ${
                    darkMode 
                      ? 'bg-gray-800 hover:bg-gray-700' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}>
                    <div className="flex items-start">
                      <span className="text-2xl mr-2">💡</span>
                      <div>
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          You seem interested in Crypto. Join the <span className="text-purple-400">Altcoin Alpha</span> community.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg transition-all ${
                    darkMode 
                      ? 'bg-gray-800 hover:bg-gray-700' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}>
                    <div className="flex items-start">
                      <span className="text-2xl mr-2">📉</span>
                      <div>
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Try predicting price movements with higher risk-reward.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg transition-all ${
                    darkMode 
                      ? 'bg-gray-800 hover:bg-gray-700' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}>
                    <div className="flex items-start">
                      <span className="text-2xl mr-2">🔔</span>
                      <div>
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Set up alerts for BTC price movements to catch trends early.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Financial News */}
              <div className={`rounded-xl p-5 border transition-colors ${
                darkMode 
                  ? 'bg-gray-900 border-gray-800' 
                  : 'bg-white border-gray-200 shadow-sm'
              }`}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Market Updates
                  </h2>
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Today
                  </span>
                </div>
                <div className="space-y-4">
                  <div className={`p-3 rounded-lg transition-all cursor-pointer ${
                    darkMode 
                      ? 'bg-gray-800 hover:bg-gray-700' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}>
                    <h3 className={`font-medium text-sm mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      RBI holds rates steady as inflation concerns persist
                    </h3>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      2 hours ago
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg transition-all cursor-pointer ${
                    darkMode 
                      ? 'bg-gray-800 hover:bg-gray-700' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}>
                    <h3 className={`font-medium text-sm mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Bitcoin hits new monthly high amid institutional inflows
                    </h3>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      5 hours ago
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg transition-all cursor-pointer ${
                    darkMode 
                      ? 'bg-gray-800 hover:bg-gray-700' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}>
                    <h3 className={`font-medium text-sm mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Gold prices continue rally as geopolitical tensions rise
                    </h3>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      8 hours ago
                    </p>
                  </div>
                </div>
                <button className={`mt-4 w-full py-2 rounded-lg text-sm transition-all flex justify-center items-center ${
                  darkMode 
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}>
                  View all updates
                  <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-10 transition-colors ${
        darkMode 
          ? 'bg-gray-900 border-t border-gray-800' 
          : 'bg-white border-t border-gray-200 shadow-lg'
      }`}>
        <div className="flex justify-around items-center h-16">
          <a href="#" className="flex flex-col items-center text-[#FF5F6D]">
            <Home size={20} />
            <span className="text-xs mt-1">Feed</span>
          </a>
          <a href="#" className={`flex flex-col items-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <Compass size={20} />
            <span className="text-xs mt-1">Discover</span>
          </a>
          <a href="#" className={`flex flex-col items-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <BookOpen size={20} />
            <span className="text-xs mt-1">Learn</span>
          </a>
          <a href="#" className={`flex flex-col items-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <User size={20} />
            <span className="text-xs mt-1">Profile</span>
          </a>
        </div>
      </div>

      {/* Prediction Details Modal */}
      <Dialog open={showPredictionDetails} onOpenChange={setShowPredictionDetails}>
        <DialogContent className={`sm:max-w-2xl max-h-[90vh] overflow-y-auto transition-colors ${
          darkMode 
            ? 'bg-gray-900 border-gray-700 text-white' 
            : 'bg-white border-gray-200 text-gray-900'
        }`}>
          <DialogHeader>
            <DialogTitle className={`text-xl font-bold flex items-center ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <Eye className="mr-2 text-blue-400" size={20} />
              Prediction Details
            </DialogTitle>
            <DialogDescription className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Comprehensive analysis and insights for this prediction
            </DialogDescription>
          </DialogHeader>
          
          {selectedPrediction && (
            <div className="py-4 space-y-6">
              {/* Prediction Overview */}
              <div className={`p-4 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  📊 Prediction Overview
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Asset:</span>
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedPrediction.asset}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Category:</span>
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedPrediction.category}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Target Price:</span>
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedPrediction.targetPrice}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Deadline:</span>
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {new Date(selectedPrediction.deadline).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Confidence:</span>
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedPrediction.confidence}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Detailed Reasoning */}
              <div className={`p-4 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  🧠 Detailed Analysis
                </h3>
                <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {selectedPrediction.reasoning}
                </p>
              </div>

              {/* Creator Information */}
              <div className={`p-4 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  👤 Creator Information
                </h3>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    {selectedPrediction.creatorName ? selectedPrediction.creatorName.charAt(0) : "?"}
                  </div>
                  <div>
                    <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedPrediction.creatorName || 'Anonymous'}
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {selectedPrediction.verified ? 'Verified Creator' : 'Community Member'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Token Cost Information */}
              <div className={`p-4 rounded-lg border ${
                darkMode 
                  ? 'bg-blue-900/20 border-blue-500/30' 
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <h3 className={`font-semibold mb-2 flex items-center ${
                  darkMode ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  <Coins className="mr-2" size={16} />
                  Token Transaction
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Cost:</span>
                    <span className={`font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      2 Tokens
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Remaining Balance:</span>
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {userTokens ? userTokens.availableTokens : 0} Tokens
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              onClick={() => setShowPredictionDetails(false)}
              className={darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}