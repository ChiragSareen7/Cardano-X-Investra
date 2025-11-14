import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { CheckCircle, XCircle, Clock, Users, TrendingUp } from 'lucide-react';
import { toast } from 'react-hot-toast';
const DAOVotingCard = ({ prediction, userAddress, onVoteSuccess }) => {
  const [hasVoted, setHasVoted] = useState(false);
  const [votingStats, setVotingStats] = useState(null);
  const [isVoting, setIsVoting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    if (prediction && userAddress) {
      checkUserVote();
      fetchVotingStats();
    }
    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [prediction, userAddress]);

  const updateTimeRemaining = () => {
    if (prediction) {
      const endTime = parseInt(prediction.endTime) * 1000;
      const now = Date.now();
      const remaining = endTime - now;

      if (remaining <= 0) {
        setTimeRemaining('Voting Ended');
        return;
      }

      const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m`);
      } else {
        setTimeRemaining(`${minutes}m`);
      }
    }
  };

  const checkUserVote = async () => {
    try {
      const response = await fetch(
        `/api/dao/predictions/${prediction.id}/has-voted/${userAddress}`
      );
      const data = await response.json();
      if (data.success) {
        setHasVoted(data.data.hasVoted);
      }
    } catch (error) {
      console.error('Error checking user vote:', error);
    }
  };

  const fetchVotingStats = async () => {
    try {
      const response = await fetch(`/api/dao/predictions/${prediction.id}/voting-stats`);
      const data = await response.json();
      if (data.success) {
        setVotingStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching voting stats:', error);
    }
  };

  const handleVote = async (support) => {
    if (!userAddress) {
      toast.error('Please connect your wallet to vote');
      return;
    }

    if (hasVoted) {
      toast.error('You have already voted on this prediction');
      return;
    }

    setIsVoting(true);
    try {
      // Use the new backend API endpoint
      const response = await fetch(`/api/dao/predictions/${prediction.id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voter: userAddress,
          support: support
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(`Vote ${support ? 'Yes' : 'No'} recorded successfully!`);
        setHasVoted(true);
        
        // Update local stats
        setVotingStats({
          yesVotes: data.data.yesVotes,
          noVotes: data.data.noVotes,
          totalVotes: data.data.totalVotes,
          approvalPercentage: Math.round((parseInt(data.data.yesVotes) / parseInt(data.data.totalVotes)) * 100).toString()
        });
        
        if (onVoteSuccess) {
          onVoteSuccess();
        }
      } else {
        throw new Error(data.message || 'Failed to vote');
      }
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to vote. Please try again.');
    } finally {
      setIsVoting(false);
    }
  };

  const getApprovalPercentage = () => {
    if (!votingStats || parseInt(votingStats.totalVotes) === 0) return 0;
    return parseInt(votingStats.approvalPercentage);
  };

  const isApproved = getApprovalPercentage() >= 70;
  const isVotingActive = new Date(parseInt(prediction.endTime) * 1000) > new Date();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold mb-2">{prediction.title}</CardTitle>
            <CardDescription className="text-gray-600 mb-3">
              {prediction.description}
            </CardDescription>
          </div>
          <Badge variant={isApproved ? "default" : isVotingActive ? "secondary" : "destructive"}>
            {isApproved ? "Approved" : isVotingActive ? "Active" : "Ended"}
          </Badge>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>Category: {prediction.category}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{timeRemaining}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {votingStats && (
          <div className="space-y-4">
            {/* Voting Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Approval Progress</span>
                <span className="font-semibold">{getApprovalPercentage()}%</span>
              </div>
              <Progress 
                value={getApprovalPercentage()} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{votingStats.yesVotes} Yes votes</span>
                <span>{votingStats.noVotes} No votes</span>
                <span>{votingStats.totalVotes} Total</span>
              </div>
            </div>

            {/* Vote Buttons */}
            {isVotingActive && !hasVoted && (
              <div className="flex gap-3">
                <Button
                  onClick={() => handleVote(true)}
                  disabled={isVoting}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Vote Yes
                </Button>
                <Button
                  onClick={() => handleVote(false)}
                  disabled={isVoting}
                  variant="destructive"
                  className="flex-1"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Vote No
                </Button>
              </div>
            )}

            {/* Vote Status */}
            {hasVoted && (
              <div className="text-center py-2">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  ✓ You have voted
                </Badge>
              </div>
            )}

            {/* Approval Status */}
            {isApproved && (
              <div className="text-center py-2">
                <Badge variant="default" className="bg-green-600 text-white">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Approved by Community (70%+ votes)
                </Badge>
              </div>
            )}

            {/* Creator Info */}
            <div className="text-xs text-gray-500 pt-2 border-t">
              Created by: {prediction.creator.slice(0, 6)}...{prediction.creator.slice(-4)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DAOVotingCard;
