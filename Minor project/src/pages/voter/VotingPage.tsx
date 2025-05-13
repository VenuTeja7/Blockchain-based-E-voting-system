import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlockchainStore } from '../../stores/blockchainStore';
import Card3D from '../../components/ui/3DCard';
import Button3D from '../../components/ui/3DButton';
import { motion } from 'framer-motion';
import { Check, ShieldCheck, User, Flag, Award } from 'lucide-react';
import { toast } from 'react-toastify';

const VotingPage = () => {
  const { 
    currentElection, 
    loadElection, 
    isConnected, 
    connectWallet, 
    castVote, 
    loadingState,
    votes
  } = useBlockchainStore();
  const navigate = useNavigate();
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [votingStep, setVotingStep] = useState<'selection' | 'confirmation' | 'success'>('selection');
  const [castingVote, setCastingVote] = useState(false);

  useEffect(() => {
    if (!currentElection) {
      loadElection();
    }
  }, [currentElection, loadElection]);

  useEffect(() => {
    if (votes.length > 0 && votingStep === 'success') {
      const timer = setTimeout(() => {
        navigate('/voter/dashboard');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [votes, votingStep, navigate]);

  const handleConnectWallet = async () => {
    await connectWallet();
  };

  const handleCandidateSelect = (candidateId: string) => {
    setSelectedCandidate(candidateId);
  };

  const handleConfirmSelection = () => {
    if (selectedCandidate) {
      setVotingStep('confirmation');
    }
  };

  const handleVote = async () => {
    if (!selectedCandidate) return;
    
    setCastingVote(true);
    try {
      const success = await castVote(selectedCandidate);
      if (success) {
        setVotingStep('success');
        toast.success('Your vote has been cast successfully!');
      } else {
        toast.error('Failed to cast vote. Please try again.');
        setVotingStep('selection');
      }
    } catch (error) {
      toast.error('An error occurred while casting your vote.');
      setVotingStep('selection');
    } finally {
      setCastingVote(false);
    }
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

  if (hasVoted && votingStep !== 'success') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card3D className="text-center p-8">
          <ShieldCheck className="w-16 h-16 text-success mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">You've Already Voted</h2>
          <p className="text-gray-600 mb-6">
            Your vote has been recorded on the blockchain and cannot be changed.
          </p>
          <Button3D onClick={() => navigate('/voter/verify')}>
            Verify Your Vote
          </Button3D>
        </Card3D>
      </div>
    );
  }

  if (!currentElection) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary"></div>
      </div>
    );
  }

  if (!currentElection.ongoing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card3D className="text-center p-8">
          <Flag className="w-16 h-16 text-warning mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Election Has Ended</h2>
          <p className="text-gray-600 mb-6">
            This election is no longer active and voting is closed.
          </p>
          <Button3D onClick={() => navigate('/voter/dashboard')}>
            Return to Dashboard
          </Button3D>
        </Card3D>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto px-4"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{votingStep === 'success' ? 'Vote Successful' : 'Cast Your Vote'}</h1>
        <p className="text-gray-600">
          {votingStep === 'selection' && 'Select your preferred candidate for the election'}
          {votingStep === 'confirmation' && 'Confirm your selection before casting your vote'}
          {votingStep === 'success' && 'Your vote has been recorded on the blockchain'}
        </p>
      </motion.div>

      {!isConnected ? (
        <motion.div variants={itemVariants}>
          <Card3D className="text-center p-8">
            <h2 className="text-xl font-semibold mb-4">Connect Your Blockchain Wallet</h2>
            <p className="text-gray-600 mb-6">
              You need to connect your blockchain wallet to cast your vote securely.
            </p>
            <Button3D
              onClick={handleConnectWallet}
              loading={loadingState === 'connecting'}
            >
              Connect Wallet
            </Button3D>
          </Card3D>
        </motion.div>
      ) : (
        <>
          {votingStep === 'selection' && (
            <>
              <motion.div variants={itemVariants} className="mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-primary mb-2">Election: {currentElection.title}</h3>
                  <p className="text-gray-600">{currentElection.description}</p>
                </div>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {currentElection.candidates.map((candidate) => (
                  <motion.div key={candidate.id} variants={itemVariants}>
                    <div
                      className={`cursor-pointer transition-all duration-300 ${
                        selectedCandidate === candidate.id
                          ? 'ring-4 ring-primary ring-opacity-50'
                          : 'hover:shadow-xl'
                      }`}
                      onClick={() => handleCandidateSelect(candidate.id)}
                    >
                      <Card3D className="h-full">
                        <div className="relative mb-4">
                          <img
                            src={candidate.imageUrl}
                            alt={candidate.name}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          {selectedCandidate === candidate.id && (
                            <div className="absolute top-2 right-2 bg-primary text-white p-2 rounded-full">
                              <Check className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <h3 className="text-xl font-semibold mb-1">{candidate.name}</h3>
                        <p className="text-gray-600 mb-3">{candidate.party}</p>
                        <Button3D
                          variant={selectedCandidate === candidate.id ? 'primary' : 'secondary'}
                          className="w-full"
                          onClick={() => handleCandidateSelect(candidate.id)}
                        >
                          {selectedCandidate === candidate.id ? 'Selected' : 'Select Candidate'}
                        </Button3D>
                      </Card3D>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <motion.div variants={itemVariants} className="flex justify-center">
                <Button3D
                  onClick={handleConfirmSelection}
                  disabled={!selectedCandidate}
                  className="px-8"
                >
                  Continue to Confirmation
                </Button3D>
              </motion.div>
            </>
          )}

          {votingStep === 'confirmation' && selectedCandidate && (
            <motion.div 
              variants={itemVariants} 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto"
            >
              <Card3D className="text-center p-8">
                <h2 className="text-2xl font-bold mb-6">Confirm Your Vote</h2>
                
                <div className="mb-8">
                  {currentElection.candidates
                    .filter(c => c.id === selectedCandidate)
                    .map(candidate => (
                      <div key={candidate.id} className="flex flex-col items-center">
                        <img
                          src={candidate.imageUrl}
                          alt={candidate.name}
                          className="w-32 h-32 object-cover rounded-full mb-4"
                        />
                        <h3 className="text-xl font-semibold">{candidate.name}</h3>
                        <p className="text-gray-600 mb-4">{candidate.party}</p>
                      </div>
                    ))}
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg mb-6 text-left">
                  <h4 className="font-medium text-yellow-800 mb-2">Important Notes:</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Your vote will be recorded on the blockchain and cannot be changed.</li>
                    <li>• This process will require a blockchain transaction.</li>
                    <li>• You can verify your vote later using the transaction receipt.</li>
                  </ul>
                </div>
                
                <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
                  <Button3D
                    variant="secondary"
                    onClick={() => setVotingStep('selection')}
                  >
                    Go Back
                  </Button3D>
                  <Button3D
                    onClick={handleVote}
                    loading={castingVote}
                  >
                    Confirm and Cast Vote
                  </Button3D>
                </div>
              </Card3D>
            </motion.div>
          )}

          {votingStep === 'success' && (
            <motion.div 
              variants={itemVariants}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto"
            >
              <Card3D className="text-center p-8">
                <div className="bg-success/10 p-4 rounded-full inline-block mb-4">
                  <Check className="w-16 h-16 text-success" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Vote Successfully Cast!</h2>
                <p className="text-gray-600 mb-6">
                  Your vote has been securely recorded on the blockchain.
                </p>
                
                {votes.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg text-left mb-6">
                    <h4 className="font-medium mb-2">Transaction Details:</h4>
                    <p className="text-sm mb-1">
                      <span className="font-medium">Hash:</span> 
                      <span className="text-gray-600 break-all"> {votes[0].transactionHash}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Time:</span> 
                      <span className="text-gray-600"> {new Date(votes[0].timestamp).toLocaleString()}</span>
                    </p>
                  </div>
                )}
                
                <p className="text-gray-600 mb-6">
                  You will be redirected to dashboard in a few seconds...
                </p>
                
                <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
                  <Button3D onClick={() => navigate('/voter/dashboard')}>
                    Return to Dashboard
                  </Button3D>
                  <Button3D
                    variant="secondary"
                    onClick={() => navigate('/voter/verify')}
                  >
                    Verify Your Vote
                  </Button3D>
                </div>
              </Card3D>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default VotingPage;