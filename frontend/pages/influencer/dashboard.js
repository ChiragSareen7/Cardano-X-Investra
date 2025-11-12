'use client';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight, 
  TrendingUp, 
  Users, 
  Target, 
  Globe, 
  Plus, 
  ArrowRight,
  Clock,
  CheckCircle,
  Zap,
  Award
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';

// mock data
const trustData = {
  accuracy: 82,
  specializations: ['Crypto', 'Mid-Cap Stocks'],
  verifiedPredictions: 44,
  avgDifficulty: 3.6
};

const statsData = [
  { id: 1, title: 'Active Predictions', value: 6, icon: TrendingUp, color: 'text-blue-400' },
  { id: 2, title: 'Followers', value: '1.2k', icon: Users, color: 'text-green-400' },
  { id: 3, title: 'Accuracy Rate', value: '82%', icon: Target, color: 'text-purple-400' },
  { id: 4, title: 'Community Memberships', value: 3, icon: Globe, color: 'text-orange-400' }
];

const activePredictions = [
  { 
    id: 1, 
    asset: 'BTC/USDT', 
    type: 'Price ↑ 10% in 7 days', 
    status: 'Active', 
    confidence: 4, 
    daysLeft: 5,
    endDate: '2025-04-22'
  },
  { 
    id: 2, 
    asset: 'ETH/USDT', 
    type: 'Price ↓ 5% in 3 days', 
    status: 'Pending Verification', 
    confidence: 3, 
    daysLeft: 1,
    endDate: '2025-04-18' 
  },
  { 
    id: 3, 
    asset: 'AAPL', 
    type: 'Earnings beat by 5%', 
    status: 'Active', 
    confidence: 5, 
    daysLeft: 10,
    endDate: '2025-04-27' 
  },
  { 
    id: 4, 
    asset: 'SOL/USDT', 
    type: 'Price ↑ 15% in 14 days', 
    status: 'Active', 
    confidence: 4, 
    daysLeft: 12,
    endDate: '2025-04-29' 
  },
  { 
    id: 5, 
    asset: 'AMZN', 
    type: 'Earnings miss by 2%', 
    status: 'Active', 
    confidence: 3, 
    daysLeft: 8,
    endDate: '2025-04-25' 
  },
  { 
    id: 6, 
    asset: 'XRP/USDT', 
    type: 'Price ↑ 8% in 5 days', 
    status: 'Active', 
    confidence: 4, 
    daysLeft: 3,
    endDate: '2025-04-20' 
  }
];

const communities = [
  { 
    id: 1, 
    name: 'CryptoVisors DAO', 
    role: 'Contributor', 
    votes: 27, 
    communityAccuracy: 76,
    badgeColor: 'bg-blue-500/20 text-blue-400'
  },
  { 
    id: 2, 
    name: 'Market Oracles', 
    role: 'Member', 
    votes: 15, 
    communityAccuracy: 81,
    badgeColor: 'bg-purple-500/20 text-purple-400'
  },
  { 
    id: 3, 
    name: 'Foresight Collective', 
    role: 'Contributor', 
    votes: 42, 
    communityAccuracy: 79,
    badgeColor: 'bg-emerald-500/20 text-emerald-400'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.4 } }
};

export default function InfluencerDashboard() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Handle theme mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  const darkMode = theme === 'dark';
  
  useEffect(() => {
    // Get wallet address from localStorage
    const connectedWallet = localStorage.getItem('connectedWalletAddress');
    if (connectedWallet) {
      setWalletAddress(connectedWallet);
    }
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Format address for display
  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  // Render confidence stars (filled or outline)
  const renderConfidence = (level) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} className={`${i < level ? 'text-yellow-400' : darkMode ? 'text-gray-600' : 'text-gray-300'}`}>●</span>
    ));
  };
  
  // Calculate days remaining
  const daysRemaining = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f0f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors ${
        darkMode 
          ? 'bg-gradient-to-br from-[#0f0f0f] to-[#141414]' 
          : 'bg-gradient-to-br from-gray-50 to-gray-100'
      }`}>
        <div className={`text-2xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-20 transition-colors ${
      darkMode 
        ? 'bg-gradient-to-br from-[#0f0f0f] to-[#141414] text-[#f5f5f5]' 
        : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900'
    }`}>
      <Head>
        <title>Influencer Dashboard | Inverstra</title>
        <meta name="description" content="Manage your predictions and community engagement" />
      </Head>
      
      <Navbar />
      
      <div className={`p-6 flex justify-between items-center border-b mt-20 transition-colors ${
        darkMode ? 'border-white/10' : 'border-gray-200'
      }`}>
        <div className="flex items-center gap-6">
          <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            <span>Connected as: </span>
            <span className={`font-mono ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {formatAddress(walletAddress)}
            </span>
          </div>

          <Link href="/influencer/create-prediction">
            <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500">
              <Plus className="mr-2 h-4 w-4" /> Create New Prediction
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notification */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className={`p-4 rounded-lg flex items-center gap-3 transition-colors ${
            darkMode 
              ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
              : 'bg-green-50 border border-green-200 text-green-700'
          }`}>
            <CheckCircle className="w-5 h-5" />
            <span>Your last prediction has been verified! +25 trust points earned.</span>
          </div>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-10"
        >
          {/* Trust Fingerprint */}
          <div className={`mt-4 p-4 rounded-xl transition-colors ${
            darkMode 
              ? 'bg-gradient-to-r from-[#3A1C71] via-[#D76D77] to-[#FFAF7B] text-white' 
              : 'bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white'
          }`}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">Your Financial Fingerprint is growing!</h3>
                    <p className="text-sm opacity-90">+12% accuracy this month</p>
                  </div>
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                    darkMode ? 'bg-white/20' : 'bg-white/30'
                  }`}>
                    <span className="text-xl">🚀</span>
                  </div>
                </div>
          </div>
          
          {/* Stats Overview */}
          <motion.section variants={itemVariants}>
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Stats Snapshot
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statsData.map((stat) => (
                <Card key={stat.id} className={`rounded-2xl shadow-md transition-all ${
                  darkMode 
                    ? 'bg-[#1a1a1a] border border-white/10 hover:shadow-blue-500/10' 
                    : 'bg-white border border-gray-200 hover:shadow-lg'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                          {stat.title}
                        </p>
                        <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
                      </div>
                      <div className={`p-2 rounded-lg bg-opacity-20 ${stat.color.replace('text', 'bg').replace('400', '500/20')}`}>
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>
          
          {/* Active Predictions */}
          <motion.section variants={itemVariants}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Active Predictions
              </h2>
              <Button variant="ghost" size="sm" className={`${
                darkMode 
                  ? 'text-slate-400 hover:text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}>
                View All <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
            
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
                {activePredictions.map((prediction) => (
                  <Card 
                    key={prediction.id}
                    className={`min-w-[280px] rounded-xl shadow-md transition-all ${
                      darkMode 
                        ? 'bg-[#1a1a1a] border border-white/10 hover:shadow-blue-500/20' 
                        : 'bg-white border-gray-200 hover:shadow-lg'
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <CardTitle className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {prediction.asset}
                        </CardTitle>
                        <Badge 
                          className={
                            prediction.status === 'Active' 
                              ? 'bg-green-500/20 text-green-400 border-green-500/30'
                              : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          }
                        >
                          {prediction.status}
                        </Badge>
                      </div>
                      <CardDescription className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        {prediction.type}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Confidence
                          </span>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${
                                  i < prediction.confidence
                                    ? 'bg-blue-500'
                                    : darkMode
                                    ? 'bg-gray-700'
                                    : 'bg-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Days Left
                          </span>
                          <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {prediction.daysLeft}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </motion.section>
          
          {/* Community Memberships */}
          <motion.section variants={itemVariants}>
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Your DAO Communities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {communities.map((community) => (
                <Card 
                  key={community.id} 
                  className={`rounded-2xl shadow-md transition-all ${
                    darkMode 
                      ? 'bg-[#1a1a1a] border border-white/10 hover:shadow-blue-500/20' 
                      : 'bg-white border border-gray-200 hover:shadow-lg'
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {community.name}
                        </h3>
                        <Badge 
                          variant="outline" 
                          className={community.badgeColor}
                        >
                          {community.role}
                        </Badge>
                      </div>
                      <Award className={`w-5 h-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className={darkMode ? 'text-slate-400' : 'text-gray-600'}>
                            Community Accuracy
                          </span>
                          <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {community.communityAccuracy}%
                          </span>
                        </div>
                        <Progress 
                          value={community.communityAccuracy} 
                          className={`h-1.5 ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`} 
                          indicatorClassName="bg-cyan-500" 
                        />
                      </div>
                      
                      <div className="text-sm">
                        <span className={darkMode ? 'text-slate-400' : 'text-gray-600'}>
                          Your contributions:
                        </span>
                        <span className={`ml-2 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {community.votes} votes
                        </span>
                      </div>
                    </div>
                    
                    <Link href= "/influencer/community-hub">
                      <Button variant="ghost" size="sm" className={`w-full ${
                        darkMode 
                          ? 'border border-white/10 hover:bg-white/5 text-white' 
                          : 'border border-gray-200 hover:bg-gray-50 text-gray-900'
                      }`}>
                        View Community
                      </Button>
                    </Link>

                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>
          
          {/* Quick Actions */}
          <motion.section variants={itemVariants}>
            <Card className={`rounded-2xl shadow-xl overflow-hidden transition-colors ${
              darkMode 
                ? 'bg-gradient-to-br from-[#1a1a1a] to-[#242424] border border-white/10' 
                : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'
            }`}>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="mb-6 md:mb-0">
                    <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Ready to make your next prediction?
                    </h3>
                    <p className={darkMode ? 'text-slate-400' : 'text-gray-600'}>
                      Create a new prediction or join a community to start contributing.
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-3">
                  <Link href="/influencer/create-prediction">
                    <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500">
                      <Plus className="mr-2 h-4 w-4" /> Create New Prediction
                    </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
}