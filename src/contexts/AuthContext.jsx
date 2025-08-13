import { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '@/store/userSlice';
import { toast } from 'react-toastify';

// Create the AuthContext
export const AuthContext = createContext(null);

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.user);

  // Logout function
  const logout = async () => {
    try {
      const { ApperUI } = window.ApperSDK;
      if (ApperUI && typeof ApperUI.logout === 'function') {
        await ApperUI.logout();
      }
      dispatch(clearUser());
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear user state even if SDK logout fails
      dispatch(clearUser());
      navigate('/login');
      toast.error('Logout failed, but you have been signed out locally');
    }
  };

  const contextValue = {
    user,
    isAuthenticated,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;