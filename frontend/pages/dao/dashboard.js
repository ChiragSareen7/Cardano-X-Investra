import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Users, TrendingUp, Clock, Plus, BarChart3, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';
import DAOPredictionsList from '../../components/dao/DAOPredictionsList';
import CreatePredictionForm from '../../components/dao/CreatePredictionForm';
import {
  getSavedWalletConnection,
  connectEternlWallet,
  isEternlInstalled,
  saveWalletConnection
} from '../../lib/cardano';

const DAODashboard = () => {
  const [userAddress, setUserAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [daoStats, setDaoStats] = useState({
    totalPredictions: 0,
    activePredictions: 0,
    approvedPredictions: 0,
    totalVotes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkWalletConnection();
    fetchDAOStats();
  }, []);

  const checkWalletConnection = async () => {
    try {
      const savedConnection = getSavedWalletConnection();
      if (savedConnection) {
        setUserAddress(savedConnection.address);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!isEternlInstalled()) {
        toast.error('Please install Eternl wallet to connect');
        return;
      }

      const { address, walletName } = await connectEternlWallet();
      saveWalletConnection(address, walletName);
      
      setUserAddress(address);
      setIsConnected(true);
      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error(error.message || 'Failed to connect wallet');
    }
  };

  const fetchDAOStats = async () => {
    setLoading(true);
    try {
      const [countResponse, activeResponse, approvedResponse] = await Promise.all([
        fetch('/api/dao/predictions/count'),
        fetch('/api/dao/predictions/active'),
        fetch('/api/dao/predictions/approved')
      ]);

      const countData = await countResponse.json();
      const activeData = await activeResponse.json();
      const approvedData = await approvedResponse.json();

      if (countData.success && activeData.success && approvedData.success) {
        setDaoStats({
          totalPredictions: parseInt(countData.data.totalPredictions),
          activePredictions: activeData.data.length,
          approvedPredictions: approvedData.data.length,
          totalVotes: 0 // This would need to be calculated from all predictions
        });
      }
    } catch (error) {
      console.error('Error fetching DAO stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePredictionCreated = (predictionId) => {
    fetchDAOStats();
    toast.success(`Prediction created with ID: ${predictionId}`);
  };

  const handleVoteSuccess = () => {
    fetchDAOStats();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">DAO Community</h1>
                <p className="text-sm text-gray-600">Decentralized Prediction Governance</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {isConnected ? (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-2" />
                    Connected
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
                  </span>
                </div>
              ) : (
                <Button onClick={connectWallet} variant="outline">
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BarChart3 className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Predictions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? '...' : daoStats.totalPredictions}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Predictions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? '...' : daoStats.activePredictions}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved Predictions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? '...' : daoStats.approvedPredictions}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Community Members</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? '...' : 'Active'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="predictions" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="predictions" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Predictions
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Prediction
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              About DAO
            </TabsTrigger>
          </TabsList>

          <TabsContent value="predictions" className="mt-6">
            <DAOPredictionsList 
              userAddress={userAddress} 
              onVoteSuccess={handleVoteSuccess}
            />
          </TabsContent>

          <TabsContent value="create" className="mt-6">
            <CreatePredictionForm 
              userAddress={userAddress}
              onPredictionCreated={handlePredictionCreated}
            />
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-6 h-6" />
                    About the DAO Community
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">
                    The DAO Community is a decentralized autonomous organization that governs prediction creation and approval through community voting. 
                    Members can submit predictions and vote on others' submissions to determine which insights deserve to be featured.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">How It Works</h3>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li>• Members create predictions with detailed reasoning</li>
                        <li>• Community votes Yes/No on each prediction</li>
                        <li>• Predictions with 70%+ approval are featured</li>
                        <li>• Voting periods range from 1-7 days</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Benefits</h3>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li>• Community-curated quality predictions</li>
                        <li>• Transparent voting process</li>
                        <li>• Decentralized governance</li>
                        <li>• Access to approved insights</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Getting Started</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold">Connect Your Wallet</h4>
                        <p className="text-sm text-gray-600">Connect your Cardano wallet (Eternl) to interact with the DAO</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold">Become a Member</h4>
                        <p className="text-sm text-gray-600">Contact the DAO admin to become a voting member</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold">Vote & Create</h4>
                        <p className="text-sm text-gray-600">Vote on active predictions or create your own</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DAODashboard;
