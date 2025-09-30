import React, { useState } from 'react';
import { HelpCircle, Mail, Settings, Check } from 'lucide-react';
import { mockFAQ } from '../data/mockData';

export const Help: React.FC = () => {
  const [email, setEmail] = useState('');
  const [settings, setSettings] = useState({
    privateAccount: true,
    mentionsReplies: true,
    pushNotifications: true,
    emailDigests: false
  });

  const handleSaveSettings = () => {
    alert('Settings saved successfully!');
  };

  const handleContact = () => {
    if (email.trim()) {
      alert(`Contact form submitted with email: ${email}`);
      setEmail('');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 pt-20 pb-24">
      {/* Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Account Settings */}
        <div className="card">
          <h3 className="text-primary font-semibold mb-4">Account</h3>
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={settings.privateAccount}
                  onChange={(e) => setSettings({...settings, privateAccount: e.target.checked})}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  settings.privateAccount 
                    ? 'bg-purple-600 border-purple-600' 
                    : 'border-gray-400'
                }`}>
                  {settings.privateAccount && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
              <span className="text-primary">Private account</span>
            </label>
            
            <label className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={settings.mentionsReplies}
                  onChange={(e) => setSettings({...settings, mentionsReplies: e.target.checked})}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  settings.mentionsReplies 
                    ? 'bg-purple-600 border-purple-600' 
                    : 'border-gray-400'
                }`}>
                  {settings.mentionsReplies && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
              <span className="text-primary">Mentions & replies</span>
            </label>
          </div>
          
          <button 
            onClick={handleSaveSettings}
            className="btn-primary w-full mt-6"
          >
            Save
          </button>
        </div>

        {/* Notification Settings */}
        <div className="card">
          <h3 className="text-primary font-semibold mb-4">Notifications</h3>
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={(e) => setSettings({...settings, pushNotifications: e.target.checked})}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  settings.pushNotifications 
                    ? 'bg-purple-600 border-purple-600' 
                    : 'border-gray-400'
                }`}>
                  {settings.pushNotifications && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
              <span className="text-primary">Push notifications</span>
            </label>
            
            <label className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={settings.emailDigests}
                  onChange={(e) => setSettings({...settings, emailDigests: e.target.checked})}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  settings.emailDigests 
                    ? 'bg-purple-600 border-purple-600' 
                    : 'border-gray-400'
                }`}>
                  {settings.emailDigests && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
              <span className="text-primary">Email digests</span>
            </label>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="card mb-6">
        <div className="flex items-center gap-3 mb-4">
          <HelpCircle className="w-6 h-6 text-purple-400" />
          <h3 className="text-primary font-semibold">FAQ</h3>
        </div>
        <div className="space-y-4">
          {mockFAQ.map((item, index) => (
            <div key={index}>
              <h4 className="text-primary font-medium mb-1">{item.question}</h4>
              <p className="text-secondary text-sm">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Mail className="w-6 h-6 text-purple-400" />
          <h3 className="text-primary font-semibold">Contact</h3>
        </div>
        <div className="flex gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="input flex-1"
          />
          <button
            onClick={handleContact}
            className="btn-primary px-6"
            disabled={!email.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};