import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useBlockchainStore, MOCK_ELECTION } from '../../stores/blockchainStore';
import Card3D from '../../components/ui/3DCard';
import Button3D from '../../components/ui/3DButton';
import { motion } from 'framer-motion';
import { Users, Award, BarChart, Clock } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const CommissionerDashboard = () => {
  const { user } = useAuthStore();
  const { 
    currentElection, 
    loadElection, 
    loadingState, 
    results,
    getElectionResults
  } = useBlockchainStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentElection) {
      loadElection();
    }
    getElectionResults();
  }, [currentElection, loadElection, getElectionResults]);

  const totalVotes = Object.values(results).reduce((sum, count) => sum + count, 0);

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

  // Prepare chart data
  const chartData = {
    labels: currentElection?.candidates.map(c => c.name) || [],
    datasets: [
      {
        data: currentElection?.candidates.map(c => results[c.id] || 0) || [],
        backgroundColor: [
          'rgba(59, 76, 202, 0.7)',
          'rgba(126, 87, 194, 0.7)',
          'rgba(255, 215, 0, 0.7)',
          'rgba(76, 175, 80, 0.7)',
          'rgba(255, 193, 7, 0.7)',
        ],
        borderColor: [
          'rgba(59, 76, 202, 1)',
          'rgba(126, 87, 194, 1)',
          'rgba(255, 215, 0, 1)',
          'rgba(76, 175, 80, 1)',
          'rgba(255, 193, 7, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    cutout: '60%',
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto px-4"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold mb-2">Commissioner Dashboard</h1>
        <p className="text-gray-600 mb-8">Monitor and manage the election process</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Voters */}
        <motion.div variants={itemVariants}>
          <Card3D className="h-full">
            <div className="flex items-center mb-4">
              <Users className="w-6 h-6 text-primary mr-2" />
              <h2 className="text-xl font-semibold">Total Votes</h2>
            </div>
            <div className="text-4xl font-bold text-primary mb-2">{totalVotes}</div>
            <p className="text-gray-600">Votes cast in current election</p>
            <div className="mt-4">
              <Button3D 
                variant="secondary"
                onClick={() => navigate('/commissioner/voters')}
                className="w-full"
              >
                View Voters
              </Button3D>
            </div>
          </Card3D>
        </motion.div>

        {/* Election Status */}
        <motion.div variants={itemVariants}>
          <Card3D className="h-full">
            <div className="flex items-center mb-4">
              <Clock className="w-6 h-6 text-primary mr-2" />
              <h2 className="text-xl font-semibold">Election Status</h2>
            </div>
            {currentElection ? (
              <>
                <div className="mb-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                    currentElection.ongoing ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {currentElection.ongoing ? 'Active' : 'Ended'}
                  </span>
                </div>
                <h3 className="text-lg font-medium mb-1">{currentElection.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{currentElection.description}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-gray-500">Start Date</div>
                    <div className="font-medium">{new Date(currentElection.startDate).toLocaleDateString()}</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-gray-500">End Date</div>
                    <div className="font-medium">{new Date(currentElection.endDate).toLocaleDateString()}</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            )}
          </Card3D>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <Card3D className="h-full">
            <div className="flex items-center mb-4">
              <Award className="w-6 h-6 text-primary mr-2" />
              <h2 className="text-xl font-semibold">Quick Actions</h2>
            </div>
            <div className="space-y-3">
              <Button3D 
                onClick={() => navigate('/commissioner/results')}
                className="w-full"
              >
                View Results
              </Button3D>
              <Button3D 
                variant="secondary"
                onClick={() => navigate('/commissioner/analysis')}
                className="w-full"
              >
                Data Analysis
              </Button3D>
              <Button3D 
                variant="accent"
                onClick={() => navigate('/commissioner/voters')}
                className="w-full text-gray-800"
              >
                Manage Voters
              </Button3D>
            </div>
          </Card3D>
        </motion.div>
      </div>

      {/* Results Chart */}
      <motion.div variants={itemVariants}>
        <Card3D className="mb-8">
          <div className="flex items-center mb-4">
            <BarChart className="w-6 h-6 text-primary mr-2" />
            <h2 className="text-xl font-semibold">Current Results</h2>
          </div>
          
          {Object.keys(results).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64">
                <Doughnut data={chartData} options={chartOptions} />
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Vote Distribution</h3>
                <div className="space-y-3">
                  {currentElection?.candidates.map(candidate => {
                    const voteCount = results[candidate.id] || 0;
                    const percentage = totalVotes > 0 
                      ? ((voteCount / totalVotes) * 100).toFixed(1) 
                      : '0';
                      
                    return (
                      <div key={candidate.id} className="flex items-center">
                        <img
                          src={candidate.imageUrl}
                          alt={candidate.name}
                          className="w-10 h-10 rounded-full object-cover mr-3"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">{candidate.name}</span>
                            <span>{voteCount} votes ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              {loadingState === 'loading' ? (
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              ) : (
                <p className="text-gray-600">No votes have been cast yet.</p>
              )}
            </div>
          )}
        </Card3D>
      </motion.div>

      {/* Candidate List */}
      <motion.div variants={itemVariants}>
        <Card3D>
          <div className="flex items-center mb-4">
            <Users className="w-6 h-6 text-primary mr-2" />
            <h2 className="text-xl font-semibold">Candidates</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentElection?.candidates.map(candidate => (
              <div key={candidate.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <img
                    src={candidate.imageUrl}
                    alt={candidate.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-medium">{candidate.name}</h3>
                    <p className="text-gray-600 text-sm">{candidate.party}</p>
                    <div className="mt-2 text-sm">
                      <span className="font-medium">{results[candidate.id] || 0}</span> votes
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card3D>
      </motion.div>
    </motion.div>
  );
};

export default CommissionerDashboard;