import { LogOut, User, Bell } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md py-4 px-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-primary">
            {user?.role === 'voter' ? 'Voter Portal' : 'Election Commissioner Portal'}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200" aria-label="Notifications">
            <Bell className="h-5 w-5 text-gray-600" />
          </button>
          
          <div className="relative group">
            <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
              <User className="h-5 w-5 text-gray-600" />
              <span className="font-medium">{user?.username}</span>
            </button>
            
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-10 hidden group-hover:block">
              <div className="py-2">
                <div className="px-4 py-2 text-sm text-gray-700">
                  <div className="font-medium">{user?.username}</div>
                  <div className="text-gray-500">{user?.email}</div>
                </div>
                <hr />
                <button 
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;