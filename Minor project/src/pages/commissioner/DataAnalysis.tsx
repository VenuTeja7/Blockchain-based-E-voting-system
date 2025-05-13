import { useState, useEffect } from 'react';
import { useBlockchainStore } from '../../stores/blockchainStore';
import Card3D from '../../components/ui/3DCard';
import Button3D from '../../components/ui/3DButton';
import { motion } from 'framer-motion';
import { BarChart, LineChart as LineChartIcon, PieChart, Download, TrendingUp, Clock, MapPin, Users } from 'lucide-react';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  PointElement,
  LineElement
} from 'chart.js';
import { Doughnut, Bar, Line, Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
);

// Mock data for analytics
const MOCK_TIMESTAMPS = Array.from({ length: 24 }, (_, i) => {
  const date = new Date();
  date.setHours(date.getHours() - 23 + i);
  return date;
});

const MOCK_HOURLY_VOTES = MOCK_TIMESTAMPS.map(() => Math.floor(Math.random() * 50) + 10);

const MOCK_AGE_GROUPS = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'];
const MOCK_AGE_DATA = MOCK_AGE_GROUPS.map(() => Math.floor(Math.random() * 400) + 100);

const MOCK_REGIONS = ['North', 'South', 'East', 'West', 'Central'];
const MOCK_REGION_DATA = MOCK_REGIONS.map(() => Math.floor(Math.random() * 500) + 200);

const DataAnalysis = () => {
  const { 
    currentElection, 
    loadElection, 
    results,
    getElectionResults
  } = useBlockchainStore();
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'demographics' | 'timing'>('overview');

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
  
  // Prepare vote timeline data
  const timelineData = {
    labels: MOCK_TIMESTAMPS.map(date => date.getHours() + ':00'),
    datasets: [
      {
        label: 'Votes Cast',
        data: MOCK_HOURLY_VOTES,
        borderColor: 'rgba(59, 76, 202, 1)',
        backgroundColor: 'rgba(59, 76, 202, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };
  
  // Prepare age demographics data
  const ageData = {
    labels: MOCK_AGE_GROUPS,
    datasets: [
      {
        label: 'Voters by Age Group',
        data: MOCK_AGE_DATA,
        backgroundColor: [
          'rgba(59, 76, 202, 0.7)',
          'rgba(76, 175, 80, 0.7)',
          'rgba(126, 87, 194, 0.7)',
          'rgba(255, 215, 0, 0.7)',
          'rgba(255, 193, 7, 0.7)',
          'rgba(244, 67, 54, 0.7)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Prepare regional data
  const regionData = {
    labels: MOCK_REGIONS,
    datasets: [
      {
        label: 'Voters by Region',
        data: MOCK_REGION_DATA,
        backgroundColor: [
          'rgba(59, 76, 202, 0.7)',
          'rgba(126, 87, 194, 0.7)',
          'rgba(255, 215, 0, 0.7)',
          'rgba(76, 175, 80, 0.7)',
          'rgba(255, 193, 7, 0.7)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Candidate votes data
  const candidateData = {
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
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };
  
  const timelineOptions = {
    ...chartOptions,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time (hours)',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Votes',
        },
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto px-4"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold mb-2">Election Data Analysis</h1>
        <p className="text-gray-600 mb-8">Detailed analytics and insights from the election</p>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-6">
        <Card3D>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <BarChart className="w-6 h-6 text-primary mr-2" />
              <h2 className="text-xl font-semibold">Election Analytics</h2>
            </div>
            <Button3D variant="secondary" className="flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button3D>
          </div>
          
          <div className="flex border-b mb-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'overview'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('demographics')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'demographics'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Demographics
            </button>
            <button
              onClick={() => setActiveTab('timing')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'timing'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Voting Timeline
            </button>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div>
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-4">Vote Distribution by Candidate</h3>
                    <div className="h-72">
                      <Doughnut data={candidateData} options={chartOptions} />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-4">Vote Percentages</h3>
                    <div className="space-y-4">
                      {currentElection?.candidates.map(candidate => {
                        const voteCount = results[candidate.id] || 0;
                        const percentage = totalVotes > 0 
                          ? ((voteCount / totalVotes) * 100).toFixed(1) 
                          : '0';
                          
                        return (
                          <div key={candidate.id}>
                            <div className="flex justify-between mb-1">
                              <div className="flex items-center">
                                <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                                  <img 
                                    src={candidate.imageUrl} 
                                    alt={candidate.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <span className="font-medium">{candidate.name}</span>
                              </div>
                              <span>{voteCount} votes ({percentage}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm text-gray-500">Total Votes</div>
                          <div className="text-xl font-bold">{totalVotes}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Election Status</div>
                          <div className={`text-sm font-medium ${
                            currentElection?.ongoing ? 'text-green-600' : 'text-yellow-600'
                          }`}>
                            {currentElection?.ongoing ? 'Active' : 'Ended'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'demographics' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center mb-4">
                      <Users className="w-5 h-5 text-primary mr-2" />
                      <h3 className="font-medium">Voter Age Distribution</h3>
                    </div>
                    <div className="h-72">
                      <Bar 
                        data={ageData} 
                        options={{
                          ...chartOptions,
                          scales: {
                            y: {
                              beginAtZero: true,
                              title: {
                                display: true,
                                text: 'Number of Voters',
                              },
                            },
                          },
                        }} 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-4">
                      <MapPin className="w-5 h-5 text-primary mr-2" />
                      <h3 className="font-medium">Voter Regional Distribution</h3>
                    </div>
                    <div className="h-72">
                      <Pie data={regionData} options={chartOptions} />
                    </div>
                  </div>
                  
                  <div className="lg:col-span-2">
                    <h3 className="font-medium mb-4">Regional Candidate Preference</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Region
                            </th>
                            {currentElection?.candidates.map(candidate => (
                              <th key={candidate.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {candidate.name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {MOCK_REGIONS.map((region, i) => (
                            <tr key={region}>
                              <td className="px-6 py-4 whitespace-nowrap font-medium">
                                {region}
                              </td>
                              {currentElection?.candidates.map((candidate, j) => {
                                // Create mock regional preference data
                                const regionPreference = Math.floor(Math.random() * 500) + 50;
                                return (
                                  <td key={candidate.id} className="px-6 py-4 whitespace-nowrap">
                                    {regionPreference}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'timing' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-3">
                    <div className="flex items-center mb-4">
                      <Clock className="w-5 h-5 text-primary mr-2" />
                      <h3 className="font-medium">Hourly Voting Activity</h3>
                    </div>
                    <div className="h-72">
                      <Line data={timelineData} options={timelineOptions} />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-4">Peak Voting Time</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-primary">
                        {MOCK_TIMESTAMPS[MOCK_HOURLY_VOTES.indexOf(Math.max(...MOCK_HOURLY_VOTES))].getHours()}:00
                      </div>
                      <p className="text-gray-600">Hour with most voting activity</p>
                      <div className="mt-2 text-sm">
                        <span className="font-medium">{Math.max(...MOCK_HOURLY_VOTES)}</span> votes recorded
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-4">Voting Pace</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-primary">
                        {(totalVotes / 24).toFixed(1)}
                      </div>
                      <p className="text-gray-600">Average votes per hour</p>
                      <div className="mt-2 text-sm">
                        Total votes: <span className="font-medium">{totalVotes}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-4">Time Distribution</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span>Morning (6AM-12PM)</span>
                            <span>32%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: '32%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span>Afternoon (12PM-6PM)</span>
                            <span>45%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: '45%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span>Evening (6PM-12AM)</span>
                            <span>19%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: '19%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span>Night (12AM-6AM)</span>
                            <span>4%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: '4%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card3D>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card3D>
          <div className="flex items-center mb-4">
            <TrendingUp className="w-6 h-6 text-primary mr-2" />
            <h2 className="text-lg font-semibold">Key Insights</h2>
          </div>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-2"></span>
              <span>Afternoon hours saw the highest voter turnout</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-2"></span>
              <span>25-34 age group had the highest participation rate</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-2"></span>
              <span>Eastern region recorded the most votes</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-2"></span>
              <span>Voting pace remained consistent throughout the election</span>
            </li>
          </ul>
        </Card3D>
        
        <Card3D>
          <div className="flex items-center mb-4">
            <BarChart className="w-6 h-6 text-primary mr-2" />
            <h2 className="text-lg font-semibold">Participation Rate</h2>
          </div>
          <div className="text-3xl font-bold text-primary mb-2">
            {((totalVotes / 3000) * 100).toFixed(1)}%
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Of eligible voters
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div
              className="bg-primary h-2.5 rounded-full"
              style={{ width: `${((totalVotes / 3000) * 100).toFixed(1)}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500">
            Total eligible voters: 3,000
          </p>
        </Card3D>
        
        <Card3D>
          <div className="flex items-center mb-4">
            <Users className="w-6 h-6 text-primary mr-2" />
            <h2 className="text-lg font-semibold">Voter Demographics</h2>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Male</span>
                <span>54%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '54%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Female</span>
                <span>45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-pink-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Non-binary</span>
                <span>1%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '1%' }}></div>
              </div>
            </div>
          </div>
        </Card3D>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card3D>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <LineChartIcon className="w-6 h-6 text-primary mr-2" />
              <h2 className="text-xl font-semibold">Predictive Analysis</h2>
            </div>
            <Button3D variant="secondary" className="flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export Insights
            </Button3D>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-4">Voting Trend Prediction</h3>
              <p className="text-gray-600 mb-4">
                Based on current voting patterns, we predict a final turnout of approximately <span className="font-bold text-primary">78%</span> of eligible voters.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current Turnout:</span>
                  <span className="font-medium">{((totalVotes / 3000) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Predicted Final Turnout:</span>
                  <span className="font-medium">78%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Expected Additional Votes:</span>
                  <span className="font-medium">{3000 * 0.78 - totalVotes}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-4">Result Confidence Level</h3>
              <p className="text-gray-600 mb-4">
                Statistical analysis indicates a <span className="font-bold text-primary">95.7%</span> confidence level in the current projected outcome.
              </p>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div
                  className="bg-primary h-4 rounded-full text-xs text-white flex items-center justify-center"
                  style={{ width: '95.7%' }}
                >
                  95.7%
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Based on statistical models and current voting patterns
              </p>
            </div>
          </div>
        </Card3D>
      </motion.div>
    </motion.div>
  );
};

export default DataAnalysis;