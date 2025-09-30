import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronRight } from 'lucide-react';

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    themeColor: 'Blue',
    fontSize: 'Medium',
    darkMode: true,
    compactMode: false,
    messageNotifications: true,
    soundNotifications: true,
    vibration: true,
    groupNotifications: true,
    onlineStatus: true,
    readReceipts: true,
    typingIndicators: true,
    autoDownloadMedia: false,
    sendWithEnter: true,
    autoSaveMedia: false,
    messagePreview: true
  });

  const handleToggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const handleSelect = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
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

  const DropdownButton = ({ value, options, onChange }: { value: string; options: string[]; onChange: (value: string) => void }) => (
    <button
      onClick={() => {
        const currentIndex = options.indexOf(value);
        const nextIndex = (currentIndex + 1) % options.length;
        onChange(options[nextIndex]);
      }}
      className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
    >
      <span>{value}</span>
      <ChevronDown className="w-4 h-4" />
    </button>
  );

  const SettingItem = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex items-center justify-between py-4 px-1 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <span className="text-gray-900 dark:text-white font-medium">{label}</span>
      {children}
    </div>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <h3 className="text-blue-600 dark:text-blue-400 font-bold text-sm uppercase tracking-wide mb-2 mt-8 first:mt-0 px-1">
      {title}
    </h3>
  );

  const NavigationItem = ({ label, onClick }: { label: string; onClick: () => void }) => (
    <button
      onClick={onClick}
      className="flex items-center justify-between py-4 px-1 w-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-200 dark:border-gray-700 last:border-b-0"
    >
      <span className="text-gray-900 dark:text-white font-medium">{label}</span>
      <ChevronRight className="w-4 h-4 text-gray-400" />
    </button>
  );

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-4 py-3 flex items-center gap-3 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => navigate('/messages')}
          className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-white" />
        </button>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">Settings</h1>
      </div>

      {/* Scrollable Content */}
      <div className="px-4 py-6 pb-24 overflow-y-auto">
        {/* APPEARANCE Section */}
        <SectionHeader title="APPEARANCE" />
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <SettingItem label="Theme Color">
            <DropdownButton
              value={settings.themeColor}
              options={['Blue', 'Purple', 'Green', 'Red']}
              onChange={(value) => handleSelect('themeColor', value)}
            />
          </SettingItem>
          <SettingItem label="Font Size">
            <DropdownButton
              value={settings.fontSize}
              options={['Small', 'Medium', 'Large']}
              onChange={(value) => handleSelect('fontSize', value)}
            />
          </SettingItem>
          <SettingItem label="Dark Mode">
            <ToggleSwitch
              isOn={settings.darkMode}
              onChange={() => handleToggle('darkMode')}
            />
          </SettingItem>
          <SettingItem label="Compact Mode">
            <ToggleSwitch
              isOn={settings.compactMode}
              onChange={() => handleToggle('compactMode')}
            />
          </SettingItem>
        </div>

        {/* NOTIFICATIONS Section */}
        <SectionHeader title="NOTIFICATIONS" />
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <SettingItem label="Message Notifications">
            <ToggleSwitch
              isOn={settings.messageNotifications}
              onChange={() => handleToggle('messageNotifications')}
            />
          </SettingItem>
          <SettingItem label="Sound Notifications">
            <ToggleSwitch
              isOn={settings.soundNotifications}
              onChange={() => handleToggle('soundNotifications')}
            />
          </SettingItem>
          <SettingItem label="Vibration">
            <ToggleSwitch
              isOn={settings.vibration}
              onChange={() => handleToggle('vibration')}
            />
          </SettingItem>
          <SettingItem label="Group Notifications">
            <ToggleSwitch
              isOn={settings.groupNotifications}
              onChange={() => handleToggle('groupNotifications')}
            />
          </SettingItem>
        </div>

        {/* PRIVACY & SECURITY Section */}
        <SectionHeader title="PRIVACY & SECURITY" />
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <SettingItem label="Online Status">
            <ToggleSwitch
              isOn={settings.onlineStatus}
              onChange={() => handleToggle('onlineStatus')}
            />
          </SettingItem>
          <SettingItem label="Read Receipts">
            <ToggleSwitch
              isOn={settings.readReceipts}
              onChange={() => handleToggle('readReceipts')}
            />
          </SettingItem>
          <SettingItem label="Typing Indicators">
            <ToggleSwitch
              isOn={settings.typingIndicators}
              onChange={() => handleToggle('typingIndicators')}
            />
          </SettingItem>
          <SettingItem label="Auto-Download Media">
            <ToggleSwitch
              isOn={settings.autoDownloadMedia}
              onChange={() => handleToggle('autoDownloadMedia')}
            />
          </SettingItem>
          <NavigationItem label="Blocked Users" onClick={() => console.log('Navigate to blocked users')} />
        </div>

        {/* CHAT SETTINGS Section */}
        <SectionHeader title="CHAT SETTINGS" />
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <SettingItem label="Send with Enter">
            <ToggleSwitch
              isOn={settings.sendWithEnter}
              onChange={() => handleToggle('sendWithEnter')}
            />
          </SettingItem>
          <SettingItem label="Auto-Save Media">
            <ToggleSwitch
              isOn={settings.autoSaveMedia}
              onChange={() => handleToggle('autoSaveMedia')}
            />
          </SettingItem>
          <SettingItem label="Message Preview">
            <ToggleSwitch
              isOn={settings.messagePreview}
              onChange={() => handleToggle('messagePreview')}
            />
          </SettingItem>
          <NavigationItem label="Chat Backups" onClick={() => console.log('Navigate to chat backups')} />
        </div>

        {/* ACCOUNT Section */}
        <SectionHeader title="ACCOUNT" />
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <NavigationItem label="Edit Profile" onClick={() => console.log('Edit profile clicked')} />
          <NavigationItem label="Change Username" onClick={() => console.log('Navigate to change username')} />
          <NavigationItem label="Active Sessions" onClick={() => console.log('Navigate to active sessions')} />
          <NavigationItem label="Export Data" onClick={() => console.log('Navigate to export data')} />
        </div>

        {/* ADVANCED Section */}
        <SectionHeader title="ADVANCED" />
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <NavigationItem label="Storage Usage" onClick={() => console.log('Navigate to storage usage')} />
          <NavigationItem label="About NeoChat" onClick={() => console.log('Navigate to about')} />
          <button className="flex items-center justify-between py-4 px-1 w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-b border-gray-200 dark:border-gray-700 last:border-b-0">
            <span className="font-medium">Clear All Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
