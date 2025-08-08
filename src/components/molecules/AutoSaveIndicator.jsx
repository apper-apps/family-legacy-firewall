import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const AutoSaveIndicator = ({ status = "saved", className }) => {
  const statusConfig = {
    saving: {
      icon: "Save",
      text: "Saving...",
      color: "text-warning-500",
      bgColor: "bg-warning-50",
      animate: "saving-pulse"
    },
    saved: {
      icon: "CheckCircle",
      text: "Saved",
      color: "text-success-500",
      bgColor: "bg-success-50",
      animate: ""
    },
    error: {
      icon: "AlertCircle",
      text: "Save failed",
      color: "text-accent-500",
      bgColor: "bg-accent-50",
      animate: ""
    }
  };

  const config = statusConfig[status] || statusConfig.saved;

  return (
    <div className={cn(
      "inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium",
      config.bgColor,
      config.color,
      config.animate,
      className
    )}>
      <ApperIcon name={config.icon} size={12} />
      <span>{config.text}</span>
    </div>
  );
};

export default AutoSaveIndicator;