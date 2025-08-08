import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { usersService } from "@/services/api/usersService";
import { sectionsService } from "@/services/api/sectionsService";
import { responsesService } from "@/services/api/responsesService";
import { progressService } from "@/services/api/progressService";

const ParticipantDetail = () => {
  const { participantId } = useParams();
  const navigate = useNavigate();
  const [participant, setParticipant] = useState(null);
  const [sections, setSections] = useState([]);
  const [responses, setResponses] = useState({});
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [participantData, sectionsData, responsesData, progressData] = await Promise.all([
        usersService.getById(parseInt(participantId)),
        sectionsService.getAll(),
        responsesService.getByUserId(parseInt(participantId)),
        progressService.getByUserId(parseInt(participantId))
      ]);
      
      setParticipant(participantData);
      setSections(sectionsData);
      
      // Organize responses by section and question
      const responsesBySectionAndQuestion = {};
      responsesData.forEach(response => {
        if (!responsesBySectionAndQuestion[response.sectionId]) {
          responsesBySectionAndQuestion[response.sectionId] = {};
        }
        responsesBySectionAndQuestion[response.sectionId][response.questionId] = response.answer;
      });
      setResponses(responsesBySectionAndQuestion);
      
      // Convert progress array to object
      const progressMap = {};
      progressData.forEach(p => {
        progressMap[p.sectionId] = p.completionPercentage;
      });
      setProgress(progressMap);
      
    } catch (err) {
      setError("Failed to load participant details. Please try again.");
      console.error("Participant detail load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (participantId) {
      loadData();
    }
  }, [participantId]);

  if (loading) return <Loading type="admin" />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (!participant) return <Error message="Participant not found" />;

  const overallProgress = Object.values(progress).reduce((sum, val) => sum + val, 0) / sections.length || 0;
  const completedSections = Object.values(progress).filter(p => p === 100).length;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Participant Header */}
      <div className="bg-gradient-to-r from-secondary-500 via-secondary-600 to-primary-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate("/admin")}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 p-2"
            >
              <ApperIcon name="ArrowLeft" size={16} />
            </Button>
            <div className="bg-white/20 p-3 rounded-xl">
              <ApperIcon name="User" size={32} className="text-white" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold mb-1">
                {participant.name}
              </h1>
              <p className="text-secondary-100">{participant.email}</p>
              <p className="text-sm text-secondary-200">
                Joined {new Date(participant.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold">{Math.round(overallProgress)}%</div>
              <div className="text-xs text-secondary-200">Overall Progress</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{completedSections}</div>
              <div className="text-xs text-secondary-200">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{sections.length}</div>
              <div className="text-xs text-secondary-200">Total Sections</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="p-6">
        <h3 className="font-display text-xl font-semibold text-gray-900 mb-4">
          Progress Overview
        </h3>
        <div className="grid md:grid-cols-4 gap-4">
          {sections.map(section => {
            const sectionProgress = progress[section.Id] || 0;
            const sectionResponses = responses[section.Id] || {};
            const answeredQuestions = Object.keys(sectionResponses).length;
            
            return (
              <div key={section.Id} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-center mb-3">
                  <div className={`p-3 rounded-full ${
                    sectionProgress === 100 
                      ? "bg-success-100" 
                      : sectionProgress > 0 
                        ? "bg-warning-100" 
                        : "bg-gray-100"
                  }`}>
                    <ApperIcon 
                      name={sectionProgress === 100 ? "CheckCircle" : "FileText"} 
                      size={20} 
                      className={
                        sectionProgress === 100 
                          ? "text-success-600" 
                          : sectionProgress > 0 
                            ? "text-warning-600" 
                            : "text-gray-500"
                      } 
                    />
                  </div>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Section {section.Id}</h4>
                <p className="text-xs text-gray-600 mb-2">{section.title}</p>
                <div className="text-lg font-bold text-gray-900 mb-1">
                  {Math.round(sectionProgress)}%
                </div>
                <div className="text-xs text-gray-500">
                  {answeredQuestions}/{section.questions.length} answered
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div 
                    className="bg-gradient-to-r from-success-500 to-success-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${sectionProgress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Detailed Responses */}
      <div className="space-y-6">
        <h3 className="font-display text-xl font-semibold text-gray-900">
          Detailed Responses
        </h3>
        
        {sections.map(section => {
          const sectionProgress = progress[section.Id] || 0;
          const sectionResponses = responses[section.Id] || {};
          
          return (
            <Card key={section.Id} className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-primary-100 to-primary-200 p-2 rounded-lg">
                    <ApperIcon name="FileText" size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-display text-lg font-semibold text-gray-900">
                      {section.title}
                    </h4>
                    <p className="text-sm text-gray-600">{section.subtitle}</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">
                    {Math.round(sectionProgress)}%
                  </div>
                  <div className="text-xs text-gray-500">Complete</div>
                </div>
              </div>

              <div className="space-y-4">
                {section.questions.map((question, index) => {
                  const answer = sectionResponses[question.Id];
                  const hasAnswer = answer && answer.trim();
                  
                  return (
                    <div key={question.Id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h5 className="font-medium text-gray-900 pr-4">
                          {index + 1}. {question.text}
                        </h5>
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                          hasAnswer 
                            ? "bg-success-100 text-success-700" 
                            : "bg-gray-100 text-gray-500"
                        }`}>
                          <ApperIcon 
                            name={hasAnswer ? "CheckCircle" : "Circle"} 
                            size={12} 
                          />
                          <span>{hasAnswer ? "Answered" : "No response"}</span>
                        </div>
                      </div>
                      
                      {hasAnswer ? (
                        <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                          {answer}
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-500 italic">
                          No response provided yet
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ParticipantDetail;