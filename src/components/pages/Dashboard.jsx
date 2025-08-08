import React from "react";
import ParticipantDashboard from "@/components/organisms/ParticipantDashboard";
import AdminDashboard from "@/components/organisms/AdminDashboard";

const Dashboard = ({ currentUser }) => {
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Please select your role to continue
          </h2>
          <p className="text-gray-600">
            Choose between Participant or Administrator access
          </p>
        </div>
      </div>
    );
  }

  if (currentUser.role === "admin") {
    return <AdminDashboard />;
  }

  return <ParticipantDashboard currentUser={currentUser} />;
};

export default Dashboard;