import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card3D from '../components/ui/3DCard';
import Input3D from '../components/ui/3DInput';
import Button3D from '../components/ui/3DButton';
import { Key, AtSign } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{username?: string, password?: string}>({});
  
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: {username?: string, password?: string} = {};
    
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const success = await login(username, password);
      
      if (success) {
        const role = username === 'voter' ? 'voter' : 'commissioner';
        toast.success(`Welcome back, ${username}!`);
        navigate(`/${role}/dashboard`);
      } else {
        toast.error('Invalid username or password');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card3D className="w-full" glassEffect>
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block p-3 bg-primary rounded-full mb-4"
            >
              <Key className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-primary">Login to BlockVote</h1>
            <p className="text-gray-600 mt-2">Secure blockchain-based voting system</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input3D
                label="Username"
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                error={errors.username}
                required
                autoFocus
                icon={<AtSign className="w-5 h-5 text-gray-400" />}
              />

              <Input3D
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                error={errors.password}
                required
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary-light border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
              </div>

              <Button3D
                type="submit"
                variant="primary"
                className="w-full"
                loading={loading}
              >
                Sign in
              </Button3D>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-primary hover:text-primary-dark">
                Register here
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center text-sm text-gray-500">
              <p>Test credentials (for demo only):</p>
              <p className="mt-1"><strong>Voter:</strong> username: voter, password: password</p>
              <p><strong>Commissioner:</strong> username: commissioner, password: password</p>
            </div>
          </div>
        </Card3D>
      </motion.div>
    </div>
  );
};

export default Login;