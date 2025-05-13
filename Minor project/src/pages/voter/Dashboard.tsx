import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useBlockchainStore, MOCK_ELECTION } from '../../stores/blockchainStore';
import Card3D from '../../components/ui/3DCard';
import Button3D from '../../components/ui/3DButton';
import { motion } from 'framer-motion';
import { Wallet, Vote, CheckCircle, AlertCircle } from 'lucide-react';

const VoterDashboard = () => {
  const { user } = useAuthStore();
  const { 
    connectWallet, 
    isConnected, 
    walletAddress, 
    loadingState, 
    currentElection,
    loadElection,
    votes 
  } = useBlockchainStore();
  const navigate = useNavigate();
  const [electionCountdown, setElectionCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (!currentElection) {
      loadElection();
    }
  }, [currentElection, loadElection]);

  // Update countdown timer
  useEffect(() => {
    if (!currentElection) return;

    const countdownTimer = setInterval(() => {
      const now = new Date();
      const endDate = new Date(currentElection.endDate);
      const timeLeft = endDate.getTime() - now.getTime();

      if (timeLeft <= 0) {
        clearInterval(countdownTimer);
        return;
      }

      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      setElectionCountdown({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, [currentElection]);

  const handleConnectWallet = async () => {
    await connectWallet();
  };

  const hasVoted = votes.length > 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto px-4"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.username}!</h1>
        <p className="text-gray-600 mb-8">Your secure blockchain voting portal</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Wallet Connection Status */}
        <motion.div variants={itemVariants}>
          <Card3D>
            <div className="flex items-center mb-4">
              <Wallet className="w-6 h-6 text-primary mr-2" />
              <h2 className="text-xl font-semibold">Blockchain Wallet</h2>
            </div>
            <div className="mb-4">
              {isConnected ? (
                <>
                  <div className="flex items-center text-success mb-2">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span>Connected</span>
                  </div>
                  <p className="text-gray-600 break-all">
                    <span className="font-medium">Address:</span> {walletAddress}
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center text-warning mb-2">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <span>Not Connected</span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Please connect your wallet to participate in the election.
                  </p>
                </>
              )}
            </div>
            <Button3D
              onClick={handleConnectWallet}
              disabled={isConnected}
              loading={loadingState === 'connecting'}
            >
              {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
            </Button3D>
          </Card3D>
        </motion.div>

        {/* Current Election */}
        <motion.div variants={itemVariants}>
          <Card3D className="h-full">
            <div className="flex items-center mb-4">
              <Vote className="w-6 h-6 text-primary mr-2" />
              <h2 className="text-xl font-semibold">Current Election</h2>
            </div>
            {currentElection ? (
              <>
                <h3 className="text-lg font-medium mb-2">{currentElection.title}</h3>
                <p className="text-gray-600 mb-4">{currentElection.description}</p>
                
                {currentElection.ongoing ? (
                  <>
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-2">Election ends in:</p>
                      <div className="grid grid-cols-4 gap-2">
                        {Object.entries(electionCountdown).map(([unit, value]) => (
                          <div key={unit} className="text-center p-2 bg-gray-100 rounded-lg">
                            <div className="text-lg font-bold">{value}</div>
                            <div className="text-xs text-gray-500">{unit}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <Button3D
                        onClick={() => navigate('/voter/vote')}
                        disabled={!isConnected || hasVoted}
                      >
                        {hasVoted ? 'Already Voted' : 'Cast Vote'}
                      </Button3D>
                      {hasVoted && (
                        <Button3D
                          variant="secondary"
                          onClick={() => navigate('/voter/verify')}
                        >
                          Verify Vote
                        </Button3D>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="bg-gray-100 p-4 rounded-lg text-center">
                    <p className="text-gray-600">This election has ended.</p>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            )}
          </Card3D>
        </motion.div>

        {/* Voting Status */}
        <motion.div variants={itemVariants}>
          <Card3D className="h-full">
            <div className="flex items-center mb-4">
              <CheckCircle className="w-6 h-6 text-primary mr-2" />
              <h2 className="text-xl font-semibold">Voting Status</h2>
            </div>
            {hasVoted ? (
              <>
                <div className="flex items-center text-success mb-4">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span>Vote Submitted</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-sm mb-1">
                    <span className="font-medium">Transaction:</span> 
                    <span className="text-gray-600 break-all"> {votes[0].transactionHash}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Time:</span> 
                    <span className="text-gray-600"> {new Date(votes[0].timestamp).toLocaleString()}</span>
                  </p>
                </div>
                <Button3D
                  variant="secondary"
                  onClick={() => navigate('/voter/verify')}
                >
                  Verify Your Vote
                </Button3D>
              </>
            ) : (
              <>
                <div className="flex items-center text-gray-500 mb-4">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span>No Vote Recorded</span>
                </div>
                <p className="text-gray-600 mb-4">
                  You haven't cast your vote in the current election yet.
                </p>
                <Button3D
                  onClick={() => navigate('/voter/vote')}
                  disabled={!isConnected || !currentElection?.ongoing}
                >
                  Cast Your Vote
                </Button3D>
              </>
            )}
          </Card3D>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default VoterDashboard;