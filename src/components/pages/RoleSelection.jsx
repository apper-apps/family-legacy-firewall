import React from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const RoleSelection = ({ onRoleSelect }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-4 rounded-2xl inline-block mb-6">
            <ApperIcon name="Home" size={32} className="text-white" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Family Legacy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Guide your family business through essential questions about purpose, future, and resilience
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-8 text-center hover:scale-[1.02] transition-all duration-300">
            <div className="bg-gradient-to-br from-secondary-100 to-secondary-200 p-6 rounded-2xl inline-block mb-6">
              <ApperIcon name="Users" size={48} className="text-secondary-600" />
            </div>
            
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">
              Participant
            </h2>
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              Explore the four foundational pillars of family business through guided questions. 
              Share your thoughts and vision for your family's legacy.
            </p>
            
            <div className="space-y-3 mb-8 text-left">
              <div className="flex items-center space-x-3">
                <ApperIcon name="Check" size={16} className="text-success-500" />
                <span className="text-sm text-gray-700">Access guided questionnaires</span>
              </div>
              <div className="flex items-center space-x-3">
                <ApperIcon name="Check" size={16} className="text-success-500" />
                <span className="text-sm text-gray-700">Auto-save your responses</span>
              </div>
              <div className="flex items-center space-x-3">
                <ApperIcon name="Check" size={16} className="text-success-500" />
                <span className="text-sm text-gray-700">Track your progress</span>
              </div>
            </div>
            
            <Button
              onClick={() => onRoleSelect("participant")}
              variant="secondary"
              className="w-full flex items-center justify-center space-x-2"
            >
              <span>Continue as Participant</span>
              <ApperIcon name="ArrowRight" size={16} />
            </Button>
          </Card>

          <Card className="p-8 text-center hover:scale-[1.02] transition-all duration-300">
            <div className="bg-gradient-to-br from-primary-100 to-primary-200 p-6 rounded-2xl inline-block mb-6">
              <ApperIcon name="Shield" size={48} className="text-primary-600" />
            </div>
            
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">
              Administrator
            </h2>
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              Monitor participant progress, review submissions, and gain insights into your 
              family business assessment journey.
            </p>
            
            <div className="space-y-3 mb-8 text-left">
              <div className="flex items-center space-x-3">
                <ApperIcon name="Check" size={16} className="text-success-500" />
                <span className="text-sm text-gray-700">View all participant responses</span>
              </div>
              <div className="flex items-center space-x-3">
                <ApperIcon name="Check" size={16} className="text-success-500" />
                <span className="text-sm text-gray-700">Track completion progress</span>
              </div>
              <div className="flex items-center space-x-3">
                <ApperIcon name="Check" size={16} className="text-success-500" />
                <span className="text-sm text-gray-700">Generate insights</span>
              </div>
            </div>
            
            <Button
              onClick={() => onRoleSelect("admin")}
              variant="primary"
              className="w-full flex items-center justify-center space-x-2"
            >
              <span>Continue as Administrator</span>
              <ApperIcon name="ArrowRight" size={16} />
            </Button>
          </Card>
        </div>

        {/* Features Overview */}
        <div className="mt-16 text-center">
          <h3 className="font-display text-2xl font-semibold text-gray-900 mb-8">
            Explore the Four Pillars
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: "Heart", title: "Reason to Begin", desc: "Why are we in business together?" },
              { icon: "Building2", title: "Business Type", desc: "End game thinking & ownership" },
              { icon: "Target", title: "Expectations", desc: "The three circles & beyond" },
              { icon: "Shield", title: "Extinction", desc: "What could go wrong?" }
            ].map((pillar, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-br from-accent-100 to-accent-200 p-4 rounded-xl inline-block mb-4">
                  <ApperIcon name={pillar.icon} size={24} className="text-accent-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">{pillar.title}</h4>
                <p className="text-sm text-gray-600">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;