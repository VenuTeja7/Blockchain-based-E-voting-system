import { useState, useEffect } from 'react';
import Card3D from '../../components/ui/3DCard';
import Button3D from '../../components/ui/3DButton';
import Input3D from '../../components/ui/3DInput';
import { motion } from 'framer-motion';
import { Users, Search, UserCheck, UserX, FileText, Download, CheckCircle, XCircle } from 'lucide-react';

// Mock voter data
interface Voter {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  walletAddress: string;
  hasVoted: boolean;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  registrationDate: Date;
}

const MOCK_VOTERS: Voter[] = Array.from({ length: 18 }, (_, i) => ({
  id: (i + 1).toString(),
  name: `Voter ${i + 1}`,
  email: `voter${i + 1}@example.com`,
  phoneNumber: `+1-555-${1000 + i}`,
  walletAddress: `0x${Math.random().toString(36).substring(2, 15)}`,
  hasVoted: Math.random() > 0.3,
  verificationStatus: ['verified', 'pending', 'rejected'][Math.floor(Math.random() * 3)] as 'verified' | 'pending' | 'rejected',
  registrationDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
}));

const VotersList = () => {
  const [voters, setVoters] = useState<Voter[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'voted' | 'not-voted'>('all');
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'verified' | 'pending' | 'rejected'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setVoters(MOCK_VOTERS);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredVoters = voters.filter(voter => {
    // Apply search filter
    const matchesSearch = 
      voter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voter.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voter.walletAddress.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply vote status filter
    const matchesVoteStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'voted' && voter.hasVoted) || 
      (filterStatus === 'not-voted' && !voter.hasVoted);
    
    // Apply verification filter
    const matchesVerification = 
      verificationFilter === 'all' || 
      voter.verificationStatus === verificationFilter;
    
    return matchesSearch && matchesVoteStatus && matchesVerification;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.05
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
        <h1 className="text-3xl font-bold mb-2">Voters Management</h1>
        <p className="text-gray-600 mb-8">View and manage registered voters</p>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-6">
        <Card3D>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search voters by name, email or wallet address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'voted' | 'not-voted')}
                className="py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Vote Status</option>
                <option value="voted">Voted</option>
                <option value="not-voted">Not Voted</option>
              </select>
              
              <select
                value={verificationFilter}
                onChange={(e) => setVerificationFilter(e.target.value as 'all' | 'verified' | 'pending' | 'rejected')}
                className="py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Verification Status</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </Card3D>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-6">
        <Card3D>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Users className="w-6 h-6 text-primary mr-2" />
              <h2 className="text-xl font-semibold">Registered Voters</h2>
            </div>
            <Button3D variant="secondary" className="flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export List
            </Button3D>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Voter
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Wallet Address
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registration Date
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredVoters.map((voter) => (
                      <tr key={voter.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center">
                              {voter.name.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{voter.name}</div>
                              <div className="text-sm text-gray-500">ID: {voter.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{voter.email}</div>
                          <div className="text-sm text-gray-500">{voter.phoneNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 font-mono">
                            {voter.walletAddress.substring(0, 8)}...{voter.walletAddress.substring(voter.walletAddress.length - 6)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col space-y-1">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              voter.hasVoted 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {voter.hasVoted ? 'Voted' : 'Not voted'}
                            </span>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              voter.verificationStatus === 'verified' 
                                ? 'bg-blue-100 text-blue-800' 
                                : voter.verificationStatus === 'pending'
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {voter.verificationStatus.charAt(0).toUpperCase() + voter.verificationStatus.slice(1)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {voter.registrationDate.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-primary hover:text-primary-dark">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredVoters.length === 0 && (
                <div className="text-center py-8">
                  <UserX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No voters found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              )}
              
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium">{filteredVoters.length}</span> of <span className="font-medium">{voters.length}</span> voters
                </div>
                <div className="flex space-x-2">
                  <Button3D variant="secondary" disabled>Previous</Button3D>
                  <Button3D variant="secondary">Next</Button3D>
                </div>
              </div>
            </>
          )}
        </Card3D>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card3D>
          <div className="flex items-center mb-4">
            <UserCheck className="w-6 h-6 text-success mr-2" />
            <h2 className="text-lg font-semibold">Verified Voters</h2>
          </div>
          <div className="text-3xl font-bold text-success mb-2">
            {voters.filter(v => v.verificationStatus === 'verified').length}
          </div>
          <p className="text-gray-600 text-sm">
            Voters with completed verification
          </p>
        </Card3D>
        
        <Card3D>
          <div className="flex items-center mb-4">
            <CheckCircle className="w-6 h-6 text-primary mr-2" />
            <h2 className="text-lg font-semibold">Votes Cast</h2>
          </div>
          <div className="text-3xl font-bold text-primary mb-2">
            {voters.filter(v => v.hasVoted).length}
          </div>
          <p className="text-gray-600 text-sm">
            {((voters.filter(v => v.hasVoted).length / voters.length) * 100).toFixed(1)}% of total registered voters
          </p>
        </Card3D>
        
        <Card3D>
          <div className="flex items-center mb-4">
            <XCircle className="w-6 h-6 text-warning mr-2" />
            <h2 className="text-lg font-semibold">Pending Verification</h2>
          </div>
          <div className="text-3xl font-bold text-warning mb-2">
            {voters.filter(v => v.verificationStatus === 'pending').length}
          </div>
          <p className="text-gray-600 text-sm">
            Voters awaiting verification
          </p>
        </Card3D>
      </motion.div>
    </motion.div>
  );
};

export default VotersList;