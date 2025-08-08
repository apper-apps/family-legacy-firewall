import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import QuestionCard from "@/components/molecules/QuestionCard";
import ProgressRing from "@/components/molecules/ProgressRing";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { sectionsService } from "@/services/api/sectionsService";
import { responsesService } from "@/services/api/responsesService";
import { progressService } from "@/services/api/progressService";
import { notificationService } from "@/services/api/notificationService";
import { toast } from "react-toastify";

const SectionQuestions = ({ currentUser }) => {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  const [section, setSection] = useState(null);
  const [responses, setResponses] = useState({});
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [sectionData, userResponses, progressData] = await Promise.all([
        sectionsService.getById(parseInt(sectionId)),
        responsesService.getByUserAndSection(currentUser.Id, parseInt(sectionId)),
        progressService.getByUserAndSection(currentUser.Id, parseInt(sectionId))
      ]);
      
      setSection(sectionData);
      
      // Convert responses array to object for easier lookup
      const responsesMap = {};
      userResponses.forEach(response => {
        responsesMap[response.questionId] = response.answer;
      });
      setResponses(responsesMap);
      
      setProgress(progressData?.completionPercentage || 0);
      
    } catch (err) {
      setError("Failed to load section data. Please try again.");
      console.error("Section load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.Id && sectionId) {
      loadData();
    }
  }, [currentUser, sectionId]);

  const handleSaveResponse = async (questionId, answer) => {
    try {
      await responsesService.saveResponse({
        userId: currentUser.Id,
        sectionId: parseInt(sectionId),
        questionId: questionId,
        answer: answer
      });
      
      // Update local responses
      setResponses(prev => ({
        ...prev,
        [questionId]: answer
      }));
      
      // Calculate and update progress
      const answeredQuestions = Object.keys({ ...responses, [questionId]: answer }).filter(
        qId => responses[qId]?.trim() || (qId === questionId.toString() && answer?.trim())
      ).length;
      
      const newProgress = (answeredQuestions / section.questions.length) * 100;
      setProgress(newProgress);
      
      // Update progress in backend
      await progressService.updateProgress(currentUser.Id, parseInt(sectionId), newProgress);
      
      return Promise.resolve();
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save response");
      return Promise.reject(err);
    }
  };

  const handleComplete = async () => {
    const unansweredQuestions = section.questions.filter(q => !responses[q.Id]?.trim());
    
    if (unansweredQuestions.length > 0) {
      toast.warning(`Please answer all questions before completing this section.`);
      return;
    }
    
    try {
await progressService.updateProgress(currentUser.Id, parseInt(sectionId), 100);
      toast.success("Section completed successfully! Admins have been notified.");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Failed to complete section");
    }
  };

  if (loading) return <Loading type="questions" />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (!section) return <Error message="Section not found" />;

  const answeredQuestions = section.questions.filter(q => responses[q.Id]?.trim()).length;
  const isComplete = answeredQuestions === section.questions.length;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-3">
              <Button
                onClick={() => navigate("/dashboard")}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 p-2"
              >
                <ApperIcon name="ArrowLeft" size={16} />
              </Button>
              <span className="text-primary-200 text-sm">Section {section.Id}</span>
            </div>
            <h1 className="font-display text-3xl font-bold mb-2">
              {section.title}
            </h1>
            <p className="text-primary-100 text-lg">
              {section.subtitle}
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <ProgressRing 
              progress={progress} 
              size={80} 
              strokeWidth={6}
              className="text-white"
            />
            <div className="text-center">
              <div className="text-2xl font-bold">{answeredQuestions}</div>
              <div className="text-xs text-primary-200">of {section.questions.length}</div>
              <div className="text-xs text-primary-200">answered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-gray-900">Your Progress</h3>
          <span className="text-sm text-gray-600">{Math.round(progress)}% complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-success-500 to-success-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        <h3 className="font-display text-xl font-semibold text-gray-900">
          Reflection Questions
        </h3>
        
        {section.questions.map((question, index) => (
          <QuestionCard
            key={question.Id}
            question={question}
            initialValue={responses[question.Id] || ""}
            onSave={handleSaveResponse}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          />
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <Button
          onClick={() => navigate("/dashboard")}
          variant="ghost"
          className="flex items-center space-x-2"
        >
          <ApperIcon name="ArrowLeft" size={16} />
          <span>Back to Dashboard</span>
        </Button>

        <div className="flex items-center space-x-4">
          {!isComplete && (
            <span className="text-sm text-gray-600">
              {section.questions.length - answeredQuestions} questions remaining
            </span>
          )}
          
          <Button
            onClick={handleComplete}
            variant={isComplete ? "accent" : "outline"}
            disabled={!isComplete}
            className="flex items-center space-x-2"
          >
            <span>{isComplete ? "Complete Section" : "Answer All Questions"}</span>
            {isComplete && <ApperIcon name="CheckCircle" size={16} />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SectionQuestions;