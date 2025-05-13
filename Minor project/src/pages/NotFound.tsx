import { useNavigate } from 'react-router-dom';
import Button3D from '../components/ui/3DButton';
import { motion } from 'framer-motion';
import { FileQuestion, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="bg-white p-8 rounded-xl shadow-xl">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block p-4 bg-primary/10 rounded-full mb-6"
          >
            <FileQuestion className="w-16 h-16 text-primary" />
          </motion.div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-3">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
          
          <p className="text-gray-600 mb-8">
            The page you are looking for might have been removed or is temporarily unavailable.
          </p>
          
          <Button3D
            onClick={() => navigate('/')}
            className="flex items-center justify-center mx-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button3D>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;