import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import VoterDashboard from './pages/voter/Dashboard';
import CommissionerDashboard from './pages/commissioner/Dashboard';
import VotingPage from './pages/voter/VotingPage';
import VoterVerification from './pages/voter/VoterVerification';
import VotersList from './pages/commissioner/VotersList';
import ElectionResults from './pages/commissioner/ElectionResults';
import DataAnalysis from './pages/commissioner/DataAnalysis';
import NotFound from './pages/NotFound';

// Layout components
import ProtectedRoute from './components/layout/ProtectedRoute';

function App() {
  const { initialized, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card-3d glass-effect p-8 rounded-xl w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Initializing application...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Voter routes */}
      <Route path="/voter" element={<ProtectedRoute role="voter" />}>
        <Route path="dashboard" element={<VoterDashboard />} />
        <Route path="vote" element={<VotingPage />} />
        <Route path="verify" element={<VoterVerification />} />
      </Route>
      
      {/* Commissioner routes */}
      <Route path="/commissioner" element={<ProtectedRoute role="commissioner" />}>
        <Route path="dashboard" element={<CommissionerDashboard />} />
        <Route path="voters" element={<VotersList />} />
        <Route path="results" element={<ElectionResults />} />
        <Route path="analysis" element={<DataAnalysis />} />
      </Route>
      
      {/* Fallback routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
