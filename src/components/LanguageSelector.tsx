import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { translationService } from '../services/translationService';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
];

export const LanguageSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(() => translationService.getCurrentLanguage());
  const [isTranslating, setIsTranslating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Only sync on mount, not continuously
  useEffect(() => {
    const currentLang = translationService.getCurrentLanguage();
    setSelectedLang(currentLang);
  }, []);

  const handleLanguageSelect = async (langCode: string) => {
    if (isTranslating || langCode === selectedLang) return;

    setIsTranslating(true);
    setIsOpen(false);

    try {
      await translationService.setLanguage(langCode);
      // Update state AFTER translation service is done
      setSelectedLang(langCode);
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const currentLanguage = languages.find(lang => lang.code === selectedLang) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Language Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isTranslating}
        className="flex items-center gap-2 px-2 py-2 rounded-lg bg-overlay-light hover:bg-overlay-dark transition-colors text-primary sm:px-3"
      >
        {/* Only show Globe icon on desktop */}
        <Globe className="w-4 h-4 hidden sm:block" />
        {/* Desktop: Show flag + name + arrow */}
        <span className="text-sm font-medium hidden sm:inline">{currentLanguage.flag} {currentLanguage.nativeName}</span>
        {/* Mobile: Only show flag (more compact) */}
        <span className="text-lg sm:hidden">{currentLanguage.flag}</span>
        {/* Only show dropdown arrow on desktop */}
        <ChevronDown className={`w-4 h-4 transition-transform hidden sm:block ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 rounded-xl shadow-2xl overflow-hidden z-50"
             style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="py-1 max-h-96 overflow-y-auto">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-overlay-light transition-colors text-left"
                disabled={isTranslating}
              >
                <span className="text-2xl">{lang.flag}</span>
                <div className="flex-1">
                  <div className="text-primary font-medium">{lang.nativeName}</div>
                  <div className="text-secondary text-xs">{lang.name}</div>
                </div>
                {selectedLang === lang.code && (
                  <Check className="w-4 h-4 text-green-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Translation Loading Overlay */}
      {isTranslating && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            <p className="text-primary font-medium">Translating page...</p>
          </div>
        </div>
      )}
    </div>
  );
};