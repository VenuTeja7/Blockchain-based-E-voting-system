import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlockchainStore } from '../../stores/blockchainStore';
import Card3D from '../../components/ui/3DCard';
import Button3D from '../../components/ui/3DButton';
import Input3D from '../../components/ui/3DInput';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertCircle, Search, Check, X } from 'lucide-react';
import { toast } from 'react-toastify';

const VoterVerification = () => {
  const { votes, verifyVote, loadingState } = useBlockchainStore();
  const navigate = useNavigate();
  
  const [transactionHash, setTransactionHash] = useState(votes.length > 0 ? votes[0].transactionHash : '');
  const [verificationState, setVerificationState] = useState<'idle' | 'success' | 'failed'>('idle');
  const [isCustomHash, setIsCustomHash] = useState(false);

  const handleVerify = async () => {
    if (!transactionHash) {
      toast.error('Please enter a transaction hash');
      return;
    }
    
    try {
      const isVerified = await verifyVote(transactionHash);
      setVerificationState(isVerified ? 'success' : 'failed');
      
      if (isVerified) {
        toast.success('Vote successfully verified!');
      } else {
        toast.error('Vote verification failed. Please check the transaction hash and try again.');
      }
    } catch (error) {
      setVerificationState('failed');
      toast.error('An error occurred during verification.');
    }
  };

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
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Verify Your Vote</h1>
        <p className="text-gray-600">Confirm that your vote was correctly recorded on the blockchain</p>
      </motion.div>

      <motion.div variants={itemVariants} className="max-w-3xl mx-auto">
        <Card3D className="p-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <ShieldCheck className="w-6 h-6 text-primary mr-2" />
            Vote Verification
          </h2>
          
          <p className="text-gray-600 mb-6">
            Enter the transaction hash of your vote to verify its authenticity and confirm it was properly recorded on the blockchain.
          </p>
          
          {votes.length > 0 && !isCustomHash ? (
            <div className="mb-6">
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="font-medium mb-2">Your Vote Transaction:</h3>
                <p className="text-sm mb-1">
                  <span className="font-medium">Hash:</span> 
                  <span className="text-gray-600 break-all"> {votes[0].transactionHash}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium">Time:</span> 
                  <span className="text-gray-600"> {new Date(votes[0].timestamp).toLocaleString()}</span>
                </p>
              </div>
              <button 
                onClick={() => setIsCustomHash(true)}
                className="text-sm text-primary hover:text-primary-dark font-medium"
              >
                Verify a different transaction hash
              </button>
            </div>
          ) : (
            <div className="mb-6">
              <Input3D
                label="Transaction Hash"
                type="text"
                id="transactionHash"
                value={transactionHash}
                onChange={(e) => setTransactionHash(e.target.value)}
                placeholder="Enter the transaction hash to verify"
              />
              {isCustomHash && votes.length > 0 && (
                <button 
                  onClick={() => {
                    setTransactionHash(votes[0].transactionHash);
                    setIsCustomHash(false);
                  }}
                  className="text-sm text-primary hover:text-primary-dark font-medium"
                >
                  Use my vote transaction hash
                </button>
              )}
            </div>
          )}
          
          <div className="flex justify-center mb-6">
            <Button3D
              onClick={handleVerify}
              disabled={!transactionHash || loadingState === 'loading'}
              loading={loadingState === 'loading'}
              className="px-6"
            >
              <Search className="w-5 h-5 mr-2" />
              Verify Vote
            </Button3D>
          </div>
          
          {verificationState !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-6 rounded-lg ${
                verificationState === 'success' ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              <div className="flex items-start">
                <div className={`p-3 rounded-full ${
                  verificationState === 'success' ? 'bg-green-100' : 'bg-red-100'
                } mr-4`}>
                  {verificationState === 'success' ? (
                    <Check className={`w-6 h-6 ${
                      verificationState === 'success' ? 'text-success' : 'text-error'
                    }`} />
                  ) : (
                    <X className="w-6 h-6 text-error" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    {verificationState === 'success' 
                      ? 'Vote Successfully Verified!' 
                      : 'Verification Failed'}
                  </h3>
                  <p className={`${
                    verificationState === 'success' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {verificationState === 'success' 
                      ? 'Your vote was found on the blockchain and has been verified as authentic.' 
                      : 'We could not verify your vote with the provided transaction hash.'}
                  </p>
                  
                  {verificationState === 'success' && (
                    <div className="mt-4 bg-white p-3 rounded border border-green-200">
                      <p className="text-sm mb-1">
                        <span className="font-medium">Transaction Hash:</span> 
                        <span className="text-gray-600 break-all"> {transactionHash}</span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Status:</span> 
                        <span className="text-success font-medium"> Confirmed on Blockchain</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </Card3D>
      </motion.div>
      
      <motion.div variants={itemVariants} className="mt-6 flex justify-center">
        <Button3D
          variant="secondary"
          onClick={() => navigate('/voter/dashboard')}
        >
          Return to Dashboard
        </Button3D>
      </motion.div>
    </motion.div>
  );
};

export default VoterVerification;