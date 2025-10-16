import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
];

export const LanguageSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en');
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

  useEffect(() => {
    // Check for saved language preference
    const savedLang = localStorage.getItem('wegram_language');
    if (savedLang && savedLang !== 'en') {
      setSelectedLang(savedLang);
      translatePage(savedLang);
    }
  }, []);

  const translatePage = async (targetLang: string) => {
    if (targetLang === 'en') {
      // Reset to original content
      window.location.reload();
      return;
    }

    setIsTranslating(true);

    try {
      // Get all text nodes in the page
      const textNodes: Node[] = [];
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            // Skip script and style tags
            const parent = node.parentElement;
            if (parent && (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE')) {
              return NodeFilter.FILTER_REJECT;
            }
            // Only accept nodes with actual text content
            if (node.textContent && node.textContent.trim().length > 0) {
              return NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_REJECT;
          }
        }
      );

      let node;
      while (node = walker.nextNode()) {
        textNodes.push(node);
      }

      // Batch translate text nodes
      const textsToTranslate = textNodes.map(node => node.textContent || '');
      const translations = await translateTexts(textsToTranslate, targetLang);

      // Apply translations
      textNodes.forEach((node, index) => {
        if (translations[index]) {
          node.textContent = translations[index];
        }
      });

      // Also translate placeholder attributes
      const elementsWithPlaceholder = document.querySelectorAll('[placeholder]');
      for (const element of Array.from(elementsWithPlaceholder)) {
        const placeholder = element.getAttribute('placeholder');
        if (placeholder) {
          const translated = await translateText(placeholder, targetLang);
          element.setAttribute('placeholder', translated);
        }
      }

      // Translate title attributes
      const elementsWithTitle = document.querySelectorAll('[title]');
      for (const element of Array.from(elementsWithTitle)) {
        const title = element.getAttribute('title');
        if (title) {
          const translated = await translateText(title, targetLang);
          element.setAttribute('title', translated);
        }
      }

    } catch (error) {
      console.error('Translation error:', error);
      alert('Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const translateTexts = async (texts: string[], targetLang: string): Promise<string[]> => {
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          texts,
          targetLang,
          sourceLang: 'en'
        })
      });

      const result = await response.json();

      if (result.success) {
        return result.translations;
      } else {
        console.error('Translation API error:', result.error);
        return texts; // Return original texts if translation fails
      }
    } catch (error) {
      console.error('Translation request failed:', error);
      return texts; // Return original texts if request fails
    }
  };

  const translateText = async (text: string, targetLang: string): Promise<string> => {
    const translations = await translateTexts([text], targetLang);
    return translations[0];
  };

  const handleLanguageSelect = (langCode: string) => {
    setSelectedLang(langCode);
    localStorage.setItem('wegram_language', langCode);
    setIsOpen(false);
    translatePage(langCode);
  };

  const currentLanguage = languages.find(lang => lang.code === selectedLang) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Language Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isTranslating}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-overlay-light hover:bg-overlay-dark transition-colors text-primary"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium hidden sm:inline">{currentLanguage.flag} {currentLanguage.nativeName}</span>
        <span className="text-sm font-medium sm:hidden">{currentLanguage.flag}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
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