import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ currentUser, onRoleSwitch }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/") return "Welcome";
    if (path === "/dashboard") return "Dashboard";
    if (path === "/admin") return "Admin Dashboard";
    if (path.startsWith("/sections/")) return "Section Questions";
    if (path.startsWith("/admin/section/")) return "Section Details";
    return "Family Legacy";
  };

  const handleRoleSwitch = () => {
    const newRole = currentUser?.role === "admin" ? "participant" : "admin";
    onRoleSwitch?.(newRole);
    navigate(newRole === "admin" ? "/admin" : "/dashboard");
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div 
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate("/")}
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
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {currentUser.role}
                  </p>
                </div>
                
                <Button
                  onClick={handleRoleSwitch}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <ApperIcon name="RefreshCw" size={14} />
                  <span>Switch Role</span>
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