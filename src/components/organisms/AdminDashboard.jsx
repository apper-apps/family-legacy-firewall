import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { usersService } from "@/services/api/usersService";
import { progressService } from "@/services/api/progressService";
import { sectionsService } from "@/services/api/sectionsService";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [participants, setParticipants] = useState([]);
  const [sections, setSections] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [participantsData, sectionsData, progressDataRes] = await Promise.all([
        usersService.getParticipants(),
        sectionsService.getAll(),
        progressService.getAll()
      ]);
      
      setParticipants(participantsData);
      setSections(sectionsData);
      setProgressData(progressDataRes);
      
    } catch (err) {
      setError("Failed to load admin data. Please try again.");
      console.error("Admin dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getParticipantProgress = (participantId) => {
    const userProgress = progressData.filter(p => p.userId === participantId);
    const totalProgress = userProgress.reduce((sum, p) => sum + p.completionPercentage, 0);
    return userProgress.length > 0 ? totalProgress / sections.length : 0;
  };

  const getSectionProgress = (participantId, sectionId) => {
    const progress = progressData.find(p => p.userId === participantId && p.sectionId === sectionId);
    return progress ? progress.completionPercentage : 0;
  };

  const viewParticipantDetails = (participantId) => {
    navigate(`/admin/participant/${participantId}`);
  };

  if (loading) return <Loading type="admin" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  if (participants.length === 0) {
    return (
      <Empty
        title="No participants yet"
        description="Participants will appear here once they start using the system."
        icon="Users"
      />
    );
  }

  const overallStats = {
    totalParticipants: participants.length,
    completedParticipants: participants.filter(p => getParticipantProgress(p.Id) === 100).length,
    averageProgress: participants.reduce((sum, p) => sum + getParticipantProgress(p.Id), 0) / participants.length || 0,
    totalSections: sections.length
  };

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-secondary-500 via-secondary-600 to-primary-600 rounded-2xl p-8 text-white">
        <h2 className="font-display text-3xl font-bold mb-2">
          Admin Dashboard
        </h2>
        <p className="text-secondary-100 mb-6">
          Monitor participant progress and manage family business assessments.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold">{overallStats.totalParticipants}</div>
            <div className="text-xs text-secondary-200">Total Participants</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{overallStats.completedParticipants}</div>
            <div className="text-xs text-secondary-200">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{Math.round(overallStats.averageProgress)}%</div>
            <div className="text-xs text-secondary-200">Average Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{overallStats.totalSections}</div>
            <div className="text-xs text-secondary-200">Total Sections</div>
          </div>
        </div>
      </div>

      {/* Participants Overview */}
      <Card className="p-6">
        <h3 className="font-display text-xl font-semibold text-gray-900 mb-6">
          Participant Progress Overview
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Participant</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Overall Progress</th>
                {sections.map(section => (
                  <th key={section.Id} className="text-center py-3 px-2 font-medium text-gray-700 text-sm">
                    Section {section.Id}
                  </th>
                ))}
                <th className="text-center py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {participants.map(participant => {
                const overallProgress = getParticipantProgress(participant.Id);
                return (
                  <tr key={participant.Id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-br from-primary-100 to-primary-200 p-2 rounded-full">
                          <ApperIcon name="User" size={16} className="text-primary-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{participant.name}</div>
                          <div className="text-sm text-gray-500">{participant.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-12 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-success-500 to-success-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${overallProgress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {Math.round(overallProgress)}%
                        </span>
                      </div>
                    </td>
                    {sections.map(section => {
                      const sectionProgress = getSectionProgress(participant.Id, section.Id);
                      return (
                        <td key={section.Id} className="py-4 px-2 text-center">
                          <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium ${
                            sectionProgress === 100 
                              ? "bg-success-100 text-success-700" 
                              : sectionProgress > 0 
                                ? "bg-warning-100 text-warning-700"
                                : "bg-gray-100 text-gray-500"
                          }`}>
                            {sectionProgress === 100 ? (
                              <ApperIcon name="Check" size={12} />
                            ) : (
                              `${Math.round(sectionProgress)}%`
                            )}
                          </div>
                        </td>
                      );
                    })}
                    <td className="py-4 px-4 text-center">
                      <Button
                        onClick={() => viewParticipantDetails(participant.Id)}
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1"
                      >
                        <ApperIcon name="Eye" size={14} />
                        <span>View</span>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Section Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sections.map(section => {
          const sectionResponses = progressData.filter(p => p.sectionId === section.Id);
          const completedCount = sectionResponses.filter(p => p.completionPercentage === 100).length;
          const averageProgress = sectionResponses.reduce((sum, p) => sum + p.completionPercentage, 0) / Math.max(sectionResponses.length, 1);
          
          return (
            <Card key={section.Id} className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-br from-accent-100 to-accent-200 p-2 rounded-lg">
                  <ApperIcon name="FileText" size={20} className="text-accent-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Section {section.Id}</h4>
                  <p className="text-sm text-gray-500">{section.title}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Completed:</span>
                  <span className="font-medium">{completedCount}/{participants.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Avg Progress:</span>
                  <span className="font-medium">{Math.round(averageProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-accent-500 to-accent-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${averageProgress}%` }}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboard;