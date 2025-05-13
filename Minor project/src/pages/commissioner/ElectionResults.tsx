import { useState, useEffect } from 'react';
import { useBlockchainStore, MOCK_ELECTION } from '../../stores/blockchainStore';
import Card3D from '../../components/ui/3DCard';
import Button3D from '../../components/ui/3DButton';
import { motion } from 'framer-motion';
import { Trophy, Download, Award, BarChart, TrendingUp, Share2 } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { toast } from 'react-toastify';

// Register Chart.js components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const ElectionResults = () => {
  const { 
    currentElection, 
    loadElection, 
    results,
    getElectionResults
  } = useBlockchainStore();
  
  const [showWinner, setShowWinner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentElection) {
      loadElection();
    }
    
    const fetchResults = async () => {
      await getElectionResults();
      setLoading(false);
    };
    
    fetchResults();
  }, [currentElection, loadElection, getElectionResults]);

  const totalVotes = Object.values(results).reduce((sum, count) => sum + count, 0);
  
  // Find winner
  const getWinner = () => {
    if (!currentElection || Object.keys(results).length === 0) return null;
    
    let maxVotes = 0;
    let winnerId = '';
    
    Object.entries(results).forEach(([candidateId, votes]) => {
      if (votes > maxVotes) {
        maxVotes = votes;
        winnerId = candidateId;
      }
    });
    
    return currentElection.candidates.find(c => c.id === winnerId) || null;
  };
  
  const winner = getWinner();

  // Prepare chart data for pie chart
  const pieChartData = {
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

  // Prepare chart data for bar chart
  const barChartData = {
    labels: currentElection?.candidates.map(c => c.name) || [],
    datasets: [
      {
        label: 'Votes',
        data: currentElection?.candidates.map(c => results[c.id] || 0) || [],
        backgroundColor: 'rgba(59, 76, 202, 0.7)',
        borderColor: 'rgba(59, 76, 202, 1)',
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
    responsive: true,
    maintainAspectRatio: false,
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
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

  const handleDeclareResults = () => {
    setShowWinner(true);
    toast.success("Election results have been officially declared!");
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto px-4"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold mb-2">Election Results</h1>
        <p className="text-gray-600 mb-8">View and analyze election results</p>
      </motion.div>

      {showWinner && winner && (
        <motion.div 
          variants={itemVariants}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <Card3D className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/20 rounded-full -ml-12 -mb-12"></div>
            
            <div className="relative z-10 text-center py-8">
              <div className="inline-block p-4 bg-accent rounded-full mb-4">
                <Trophy className="w-12 h-12 text-yellow-900" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Winner Declared!</h2>
              <p className="text-xl text-gray-600 mb-6">The election has officially concluded</p>
              
              <div className="flex flex-col items-center justify-center mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                  <img 
                    src={winner.imageUrl} 
                    alt={winner.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-1">{winner.name}</h3>
                <p className="text-lg text-gray-600 mb-3">{winner.party}</p>
                <div className="bg-primary text-white px-6 py-2 rounded-full font-bold">
                  {results[winner.id] || 0} votes ({totalVotes > 0 ? (((results[winner.id] || 0) / totalVotes) * 100).toFixed(1) : 0}%)
                </div>
              </div>
              
              <div className="flex justify-center gap-4">
                <Button3D variant="secondary" className="flex items-center">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Results
                </Button3D>
                <Button3D variant="accent" className="flex items-center text-gray-800">
                  <Download className="w-4 h-4 mr-2" />
                  Download Certificate
                </Button3D>
              </div>
            </div>
          </Card3D>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card3D>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <BarChart className="w-6 h-6 text-primary mr-2" />
                <h2 className="text-xl font-semibold">Vote Distribution</h2>
              </div>
              <Button3D variant="secondary" className="flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button3D>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="h-72">
                <Bar data={barChartData} options={barChartOptions} />
              </div>
            )}
          </Card3D>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card3D className="h-full">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-6 h-6 text-primary mr-2" />
              <h2 className="text-xl font-semibold">Summary</h2>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <div className="text-4xl font-bold text-primary mb-1">{totalVotes}</div>
                  <p className="text-gray-600">Total votes cast</p>
                </div>
                
                <div className="h-48 mb-4">
                  <Doughnut data={pieChartData} options={chartOptions} />
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="font-medium mb-2">Leading Candidate</div>
                    {winner && (
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                          <img 
                            src={winner.imageUrl} 
                            alt={winner.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{winner.name}</div>
                          <div className="text-sm text-gray-600">
                            {results[winner.id] || 0} votes ({totalVotes > 0 ? (((results[winner.id] || 0) / totalVotes) * 100).toFixed(1) : 0}%)
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {!currentElection?.ongoing && !showWinner && (
                    <Button3D
                      onClick={handleDeclareResults}
                      className="w-full flex items-center justify-center"
                    >
                      <Award className="w-5 h-5 mr-2" />
                      Declare Results
                    </Button3D>
                  )}
                </div>
              </>
            )}
          </Card3D>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Card3D>
          <div className="flex items-center mb-6">
            <Trophy className="w-6 h-6 text-primary mr-2" />
            <h2 className="text-xl font-semibold">Detailed Results</h2>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Party
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Votes
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentElection?.candidates
                    .sort((a, b) => (results[b.id] || 0) - (results[a.id] || 0))
                    .map((candidate, index) => {
                      const voteCount = results[candidate.id] || 0;
                      const percentage = totalVotes > 0 
                        ? ((voteCount / totalVotes) * 100).toFixed(1) 
                        : '0';
                      
                      return (
                        <tr key={candidate.id} className={index === 0 ? 'bg-yellow-50' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {index + 1}
                            {index === 0 && <Trophy className="inline-block ml-1 w-4 h-4 text-accent" />}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                                <img 
                                  src={candidate.imageUrl} 
                                  alt={candidate.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {candidate.party}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {voteCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                                <div
                                  className={`h-2.5 rounded-full ${index === 0 ? 'bg-primary' : 'bg-secondary'}`}
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-500">{percentage}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </Card3D>
      </motion.div>
    </motion.div>
  );
};

export default ElectionResults;