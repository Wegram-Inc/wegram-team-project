import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X, Camera, ChevronDown, Check } from 'lucide-react';

export const CreateGroup: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    tags: 'crypto, trading, bitcoin',
    memberLimit: '500 members',
    privacy: 'public',
    mediaSharing: true,
    voiceMessages: true,
    pollsVoting: false,
    botIntegration: false,
    autoModeration: true,
    slowMode: false,
    messageApproval: false
  });

  const categories = ['Technology', 'Crypto', 'Trading', 'Gaming', 'Art', 'Music', 'Sports', 'Education'];
  const memberLimits = ['100 members', '500 members', '1000 members', '5000 members', '200,000 members'];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Create group logic here
      console.log('Creating group:', formData);
      navigate('/messages');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/messages');
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Add Photo */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-pink-500 flex items-center justify-center">
          <Camera className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg">Add Photo</h3>
          <p className="text-gray-300 text-sm">Choose a profile picture for your group</p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-white font-semibold mb-2">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter group name"
            className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Description</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="What is your group about?"
            className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Category</label>
          <div className="relative">
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent appearance-none"
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-white font-semibold mb-2">Tags (comma separated)</label>
        <input
          type="text"
          value={formData.tags}
          onChange={(e) => handleInputChange('tags', e.target.value)}
          className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div>
        <label className="block text-white font-semibold mb-2">Member Limit</label>
        <div className="relative">
          <select
            value={formData.memberLimit}
            onChange={(e) => handleInputChange('memberLimit', e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent appearance-none"
          >
            {memberLimits.map(limit => (
              <option key={limit} value={limit}>{limit}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-4">Privacy Settings</h3>
        <div className="space-y-3">
          {[
            { value: 'public', label: 'Public', description: 'Anyone can find this group in search and join' },
            { value: 'private', label: 'Private', description: 'Only invited members can find and join this group' }
          ].map(option => (
            <button
              key={option.value}
              onClick={() => handleInputChange('privacy', option.value)}
              className={`w-full p-4 rounded-lg text-left transition-colors ${
                formData.privacy === option.value ? 'bg-blue-500 bg-opacity-20 border border-blue-500' : 'bg-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  formData.privacy === option.value ? 'border-blue-500 bg-blue-500' : 'border-gray-400'
                }`}>
                  {formData.privacy === option.value && <Check className="w-3 h-3 text-white" />}
                </div>
                <div>
                  <div className="text-white font-semibold">{option.label}</div>
                  <div className="text-gray-300 text-sm">{option.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-white font-semibold mb-4">Group Features</h3>
        <div className="space-y-4">
          {[
            { key: 'mediaSharing', label: 'Media Sharing', description: 'Allow members to share images, videos, and files' },
            { key: 'voiceMessages', label: 'Voice Messages', description: 'Enable voice message recording and playback' },
            { key: 'pollsVoting', label: 'Polls & Voting', description: 'Allow members to create polls and vote' },
            { key: 'botIntegration', label: 'Bot Integration', description: 'Enable bots and automated features' }
          ].map(feature => (
            <div key={feature.key} className="flex items-start gap-3">
              <button
                onClick={() => handleInputChange(feature.key, !formData[feature.key as keyof typeof formData])}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                  formData[feature.key as keyof typeof formData] ? 'border-blue-500 bg-blue-500' : 'border-gray-400'
                }`}
              >
                {formData[feature.key as keyof typeof formData] && <Check className="w-3 h-3 text-white" />}
              </button>
              <div className="flex-1">
                <div className="text-white font-semibold">{feature.label}</div>
                <div className="text-gray-300 text-sm">{feature.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-4">Moderation Settings</h3>
        <div className="space-y-4">
          {[
            { key: 'autoModeration', label: 'Auto Moderation', description: 'Automatically filter spam and inappropriate content' },
            { key: 'slowMode', label: 'Slow Mode', description: 'Limit how often members can send messages' },
            { key: 'messageApproval', label: 'Message Approval', description: 'Require admin approval for new member messages' }
          ].map(feature => (
            <div key={feature.key} className="flex items-start gap-3">
              <button
                onClick={() => handleInputChange(feature.key, !formData[feature.key as keyof typeof formData])}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                  formData[feature.key as keyof typeof formData] ? 'border-blue-500 bg-blue-500' : 'border-gray-400'
                }`}
              >
                {formData[feature.key as keyof typeof formData] && <Check className="w-3 h-3 text-white" />}
              </button>
              <div className="flex-1">
                <div className="text-white font-semibold">{feature.label}</div>
                <div className="text-gray-300 text-sm">{feature.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-opacity-95 backdrop-blur-sm px-4 py-3 flex items-center gap-3 bg-gray-900">
        <button
          onClick={handleBack}
          className="p-2 rounded-lg transition-colors hover:bg-gray-800"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-lg font-bold text-white">New Group</h1>
        <button
          onClick={() => navigate('/messages')}
          className="ml-auto p-2 rounded-lg transition-colors hover:bg-gray-800"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="px-4 py-6">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={handleBack}
            className="flex-1 py-3 px-6 bg-gray-700 text-white rounded-lg font-medium transition-colors hover:bg-gray-600"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium transition-colors hover:from-blue-600 hover:to-purple-700"
          >
            {step === 3 ? 'Create Group' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};
