import React, { useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AuthContext } from '../../App'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const currentUser = useSelector((state) => state.user.user);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/") return "Welcome";
    if (path === "/dashboard") return "Dashboard";
    if (path === "/admin") return "Admin Dashboard";
    if (path.startsWith("/sections/")) return "Section Questions";
    if (path.startsWith("/admin/section/")) return "Section Details";
    return "Family Legacy";
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div 
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-2 rounded-lg">
                <ApperIcon name="Home" size={20} className="text-white" />
              </div>
              <div>
                <h1 className="font-display text-xl font-semibold text-gray-900">
                  Family Legacy
                </h1>
                <p className="text-xs text-gray-500">{getPageTitle()}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {currentUser && (
              <>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {currentUser.Name || currentUser.firstName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {currentUser.role_c || currentUser.role || 'participant'}
                  </p>
                </div>
                
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <ApperIcon name="LogOut" size={14} />
                  <span>Logout</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;