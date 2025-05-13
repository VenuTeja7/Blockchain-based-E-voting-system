import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Vote, 
  CheckCircle, 
  Users, 
  BarChart, 
  Award,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  role: 'voter' | 'commissioner';
}

const Sidebar = ({ role }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const voterLinks = [
    { name: 'Dashboard', path: '/voter/dashboard', icon: <Home /> },
    { name: 'Vote', path: '/voter/vote', icon: <Vote /> },
    { name: 'Verification', path: '/voter/verify', icon: <CheckCircle /> },
  ];
  
  const commissionerLinks = [
    { name: 'Dashboard', path: '/commissioner/dashboard', icon: <Home /> },
    { name: 'Voters', path: '/commissioner/voters', icon: <Users /> },
    { name: 'Results', path: '/commissioner/results', icon: <Award /> },
    { name: 'Analysis', path: '/commissioner/analysis', icon: <BarChart /> },
  ];
  
  const links = role === 'voter' ? voterLinks : commissionerLinks;
  
  return (
    <motion.aside
      className={`bg-primary text-white h-screen shadow-xl transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
      initial={false}
      animate={{ width: collapsed ? 80 : 256 }}
    >
      <div className="flex justify-between items-center p-4 h-16">
        {!collapsed && (
          <motion.h2 
            className="text-xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            BlockVote
          </motion.h2>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-full hover:bg-primary-dark transition-colors duration-200"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>
      
      <nav className="mt-8">
        <ul className="space-y-2 px-3">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            
            return (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary-dark text-white' 
                      : 'text-gray-200 hover:bg-primary-light'
                  }`}
                >
                  <div className="text-xl">{link.icon}</div>
                  {!collapsed && (
                    <motion.span 
                      className="ml-3 font-medium"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {link.name}
                    </motion.span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="absolute bottom-0 w-full">
        <div className={`p-4 ${collapsed ? 'text-center' : ''}`}>
          {!collapsed && (
            <motion.div
              className="text-sm text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              Secured by Blockchain
            </motion.div>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;