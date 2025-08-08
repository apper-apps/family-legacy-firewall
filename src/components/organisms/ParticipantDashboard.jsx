import React, { useEffect, useState } from "react";
import { sectionsService } from "@/services/api/sectionsService";
import { progressService } from "@/services/api/progressService";
import ApperIcon from "@/components/ApperIcon";
import SectionCard from "@/components/molecules/SectionCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const ParticipantDashboard = ({ currentUser }) => {
  const [sections, setSections] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [sectionsData, progressData] = await Promise.all([
        sectionsService.getAll(),
        progressService.getByUserId(currentUser.Id)
      ]);
      
      setSections(sectionsData);
      
      // Convert progress array to object for easier lookup
      const progressMap = {};
      progressData.forEach(p => {
        progressMap[p.sectionId] = p.completionPercentage;
      });
      setProgress(progressMap);
      
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.Id) {
      loadData();
    }
  }, [currentUser]);

  if (loading) return <Loading type="dashboard" />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (sections.length === 0) {
    return (
      <Empty
        title="No sections available"
        description="Sections will appear here once they are configured."
        icon="FileText"
      />
    );
  }

  const totalProgress = Object.values(progress).reduce((sum, val) => sum + val, 0) / sections.length || 0;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
<div className="bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="font-display text-3xl font-bold mb-2">
              Welcome back, {currentUser?.name}
            </h2>
            <p className="text-primary-100 mb-6">
              Continue your family business journey by exploring the four foundational pillars.
            </p>
          </div>
          <button
            onClick={() => window.location.href = '/profile'}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <ApperIcon name="Settings" size={16} />
            Edit Profile
          </button>
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="text-2xl font-bold">{Math.round(totalProgress)}%</div>
            <div className="text-xs text-primary-200">Overall Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {Object.values(progress).filter(p => p === 100).length}
            </div>
            <div className="text-xs text-primary-200">Completed Sections</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{sections.length}</div>
            <div className="text-xs text-primary-200">Total Sections</div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="font-display text-xl font-semibold text-gray-900 mb-4">
          Your Progress Overview
        </h3>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div 
            className="bg-gradient-to-r from-success-500 to-success-600 h-3 rounded-full transition-all duration-1000"
            style={{ width: `${totalProgress}%` }}
          />
        </div>
        <p className="text-sm text-gray-600">
          {Math.round(totalProgress)}% complete across all sections
        </p>
      </div>

      {/* Sections Grid */}
      <div>
        <h3 className="font-display text-xl font-semibold text-gray-900 mb-6">
          Explore the Four Pillars
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section) => (
            <SectionCard
              key={section.Id}
              section={section}
              progress={progress[section.Id] || 0}
              userRole="participant"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParticipantDashboard;