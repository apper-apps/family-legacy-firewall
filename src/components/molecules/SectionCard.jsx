import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ProgressRing from "@/components/molecules/ProgressRing";
import ApperIcon from "@/components/ApperIcon";

const SectionCard = ({ section, progress = 0, userRole = "participant" }) => {
  const navigate = useNavigate();

  const handleStart = () => {
    if (userRole === "participant") {
      navigate(`/sections/${section.Id}`);
    } else {
      navigate(`/admin/section/${section.Id}`);
    }
  };

  const getIcon = (sectionOrder) => {
    const icons = {
      1: "Heart",
      2: "Building2",
      3: "Target",
      4: "Shield"
    };
    return icons[sectionOrder] || "FileText";
  };

  const isComplete = progress === 100;

  return (
    <Card className="p-6 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-primary-100 to-primary-200 p-3 rounded-lg">
              <ApperIcon 
                name={getIcon(section.order_c)} 
                size={24} 
                className="text-primary-600" 
              />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-gray-900 mb-1">
                {section.title_c}
              </h3>
              <p className="text-sm text-gray-600">
                {section.subtitle_c}
              </p>
            </div>
          </div>
          <ProgressRing progress={progress} size={60} strokeWidth={4} />
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">
            {section.questions?.length || 0} questions
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-success-500 to-success-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          {isComplete ? "Completed" : `${Math.round(progress)}% complete`}
        </span>
        <Button
          onClick={handleStart}
          variant={isComplete ? "secondary" : "primary"}
          size="sm"
          className="flex items-center space-x-2"
        >
          <span>{isComplete ? "Review" : "Start"}</span>
          <ApperIcon name="ArrowRight" size={14} />
        </Button>
      </div>
    </Card>
  );
};

export default SectionCard;