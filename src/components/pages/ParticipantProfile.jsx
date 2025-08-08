import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import TextArea from '@/components/atoms/TextArea';
import ApperIcon from '@/components/ApperIcon';
import { usersService } from '@/services/api/usersService';

function ParticipantProfile({ currentUser }) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    company: currentUser?.company || '',
    position: currentUser?.position || '',
    bio: currentUser?.bio || ''
  });

  const [errors, setErrors] = useState({});

  function handleInputChange(field, value) {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  }

  function validateForm() {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSave() {
    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    setIsSaving(true);
    try {
      await usersService.update(currentUser.Id, formData);
      
      toast.success('Profile updated successfully! Admins have been notified of your changes.');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancel() {
    setFormData({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      company: currentUser?.company || '',
      position: currentUser?.position || '',
      bio: currentUser?.bio || ''
    });
    setErrors({});
    setIsEditing(false);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl font-bold text-primary-600 mb-2">
            My Profile
          </h1>
          <p className="text-gray-600">
            View and edit your personal information
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2"
        >
          <ApperIcon name="ArrowLeft" size={16} />
          Back to Dashboard
        </Button>
      </div>

      <Card className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {currentUser?.name?.charAt(0)?.toUpperCase() || 'P'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary-600">
                {currentUser?.name}
              </h2>
              <p className="text-gray-600 capitalize">
                {currentUser?.role} Account
              </p>
            </div>
          </div>
          
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2"
            >
              <ApperIcon name="Edit" size={16} />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={handleCancel}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                <ApperIcon name="X" size={16} />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                {isSaving ? (
                  <ApperIcon name="Loader2" size={16} className="animate-spin" />
                ) : (
                  <ApperIcon name="Save" size={16} />
                )}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              disabled={!isEditing}
              error={errors.name}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={!isEditing}
              error={errors.email}
              placeholder="Enter your email address"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              disabled={!isEditing}
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company
            </label>
            <Input
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              disabled={!isEditing}
              placeholder="Enter your company name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position/Title
            </label>
            <Input
              value={formData.position}
              onChange={(e) => handleInputChange('position', e.target.value)}
              disabled={!isEditing}
              placeholder="Enter your job title"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <TextArea
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              disabled={!isEditing}
              placeholder="Tell us about yourself and your role in the family business"
              rows={4}
            />
          </div>
        </div>

        {!isEditing && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <ApperIcon name="Info" size={20} className="text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900 mb-1">
                    Profile Updates
                  </h3>
                  <p className="text-sm text-blue-700">
                    When you make changes to your profile, all administrators will be automatically notified 
                    about the updates to keep them informed of your progress and information changes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export default ParticipantProfile;