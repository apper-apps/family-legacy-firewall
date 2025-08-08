import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { authService } from "@/services/api/authService";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Demo credentials for easy testing
  const demoCredentials = [
    { email: "admin@familylegacy.com", password: "admin123", role: "admin" },
    { email: "sarah.johnson@example.com", password: "participant123", role: "participant" }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors and try again');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const user = await authService.authenticate(formData.email, formData.password);
      
      if (user) {
        toast.success(`Welcome back, ${user.name}!`);
        onLogin(user);
        
        // Navigate based on role
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        toast.error('Invalid email or password');
        setErrors({
          general: 'Invalid email or password. Please check your credentials and try again.'
        });
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
      setErrors({
        general: 'Something went wrong. Please try again later.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (credentials) => {
    setFormData({
      email: credentials.email,
      password: credentials.password
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-4 rounded-2xl inline-block mb-6">
            <ApperIcon name="Home" size={32} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to continue your family business journey
          </p>
        </div>

        {/* Login Form */}
        <Card className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {errors.general && (
              <div className="bg-accent-50 border border-accent-200 text-accent-700 px-4 py-3 rounded-lg text-sm">
                {errors.general}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full ${errors.email ? 'border-accent-500' : ''}`}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-accent-600">{errors.email}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full ${errors.password ? 'border-accent-500' : ''}`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-accent-600">{errors.password}</p>
              )}
            </div>
            
            <Button
              type="submit"
              variant="primary"
              className="w-full flex items-center justify-center space-x-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ApperIcon name="ArrowRight" size={16} />
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Demo Credentials */}
        <div className="mt-8">
          <div className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl p-6">
            <h3 className="font-medium text-gray-900 mb-4 text-center">
              Demo Credentials
            </h3>
            <div className="space-y-3">
              {demoCredentials.map((cred, index) => (
                <button
                  key={index}
                  onClick={() => handleDemoLogin(cred)}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {cred.role === 'admin' ? 'Administrator' : 'Participant'}
                      </div>
                      <div className="text-xs text-gray-500">{cred.email}</div>
                    </div>
                    <ApperIcon 
                      name={cred.role === 'admin' ? 'Shield' : 'User'} 
                      size={16} 
                      className="text-gray-400"
                    />
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 text-center mt-4">
              Click on any credential above to auto-fill the form
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;