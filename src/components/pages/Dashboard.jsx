import React from "react";
import { useSelector } from "react-redux";
import ParticipantDashboard from "@/components/organisms/ParticipantDashboard";
import AdminDashboard from "@/components/organisms/AdminDashboard";
import Loading from "@/components/ui/Loading";

const Dashboard = () => {
  const currentUser = useSelector((state) => state.user.user);

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading dashboard...
          </h2>
          <p className="text-gray-600">
            Please wait while we load your information
          </p>
        </div>
      </div>
    );
  }

  if (currentUser.role_c === "admin") {
    return <AdminDashboard />;
  }

  return <ParticipantDashboard />;
};

export default Dashboard;
