import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    onlineStatus: true,
    messageNotifications: true,
    typingIndicator: true
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('messagesSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('messagesSettings', JSON.stringify(settings));
  }, [settings]);

  const handleToggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const ToggleSwitch = ({ isOn, onChange }: { isOn: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`w-12 h-6 rounded-full transition-all duration-200 ${
        isOn
          ? 'bg-gradient-to-r from-blue-500 to-purple-600'
          : 'bg-gray-300 dark:bg-gray-600'
      }`}
    >
      <div
        className={`w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-200 ${
          isOn ? 'translate-x-6' : 'translate-x-0.5'
        }`}
      />
    </button>
  );

  const SettingItem = ({ label, description, children }: { label: string; description: string; children: React.ReactNode }) => (
    <div className="flex items-center justify-between py-4 px-4">
      <div className="flex-1">
        <div className="text-primary font-medium text-sm">{label}</div>
        <div className="text-secondary text-xs mt-1">{description}</div>
      </div>
      {children}
    </div>
  );

  return (
    <div className="max-w-md mx-auto px-4 pt-20 pb-24" style={{ backgroundColor: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/messages')}
          className="p-2 hover:bg-overlay-light rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
        </button>
        <h1 className="text-xl font-bold text-primary">Messages Settings</h1>
      </div>

      {/* Settings */}
      <div className="card">
        <SettingItem
          label="Show Online Status"
          description="Let others see when you're online"
        >
          <ToggleSwitch
            isOn={settings.onlineStatus}
            onChange={() => handleToggle('onlineStatus')}
          />
        </SettingItem>

        <div className="border-t border-gray-200 dark:border-gray-700" />

        <SettingItem
          label="Message Notifications"
          description="Turn sound and alerts on/off"
        >
          <ToggleSwitch
            isOn={settings.messageNotifications}
            onChange={() => handleToggle('messageNotifications')}
          />
        </SettingItem>

        <div className="border-t border-gray-200 dark:border-gray-700" />

        <SettingItem
          label="Typing Indicator"
          description="Show when you're typing to others"
        >
          <ToggleSwitch
            isOn={settings.typingIndicator}
            onChange={() => handleToggle('typingIndicator')}
          />
        </SettingItem>
      </div>

      {/* Info */}
      <div className="mt-6 px-4">
        <p className="text-secondary text-xs text-center">
          These settings are saved to your device and will persist between sessions.
        </p>
      </div>
    </div>
  );
};