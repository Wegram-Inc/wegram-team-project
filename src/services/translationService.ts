// Global Translation Service
class TranslationService {
  private originalTexts = new Map<Node, string>();
  private originalAttributes = new Map<Element, Map<string, string>>();
  private currentLanguage = 'en';
  private observer: MutationObserver | null = null;
  private isTranslating = false;
  private translationCache = new Map<string, Map<string, string>>();

  constructor() {
    // Initialize on page load
    this.initialize();
  }

  private initialize() {
    // Check for saved language preference
    const savedLang = localStorage.getItem('wegram_language');
    if (savedLang && savedLang !== 'en') {
      this.currentLanguage = savedLang;
      // Apply translations after DOM loads
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          this.applyTranslation(savedLang);
        });
      } else {
        // DOM already loaded
        setTimeout(() => {
          this.applyTranslation(savedLang);
        }, 100);
      }
    }
  }

  public async setLanguage(language: string) {
    if (this.isTranslating) return;

    this.currentLanguage = language;
    localStorage.setItem('wegram_language', language);

    if (language === 'en') {
      // Restore original English text
      this.restoreOriginal();
    } else {
      await this.applyTranslation(language);
    }
  }

  private async applyTranslation(targetLang: string) {
    if (this.isTranslating) return;
    this.isTranslating = true;

    try {
      // Stop observing during translation
      this.stopObserver();

      // Store original texts if not already stored
      this.storeOriginalTexts();

      // Get all texts to translate
      const textsToTranslate = this.collectTexts();

      // Translate in batches
      const translations = await this.translateBatch(textsToTranslate, targetLang);

      // Apply translations
      this.applyTranslations(translations, targetLang);

      // Start observing for new content
      this.startObserver(targetLang);

    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      this.isTranslating = false;
    }
  }

  private storeOriginalTexts() {
    // Only store if we haven't stored yet
    if (this.originalTexts.size > 0) return;

    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;

          // Skip script, style, and other non-visible elements
          const tagName = parent.tagName;
          if (tagName === 'SCRIPT' || tagName === 'STYLE' || tagName === 'NOSCRIPT') {
            return NodeFilter.FILTER_REJECT;
          }

          // Only accept nodes with actual text
          const text = node.textContent?.trim();
          if (text && text.length > 0) {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_REJECT;
        }
      }
    );

    let node;
    while (node = walker.nextNode()) {
      this.originalTexts.set(node, node.textContent || '');
    }

    // Store original attributes
    document.querySelectorAll('[placeholder], [title], [alt], [aria-label]').forEach(element => {
      const attrs = new Map<string, string>();

      if (element.hasAttribute('placeholder')) {
        attrs.set('placeholder', element.getAttribute('placeholder') || '');
      }
      if (element.hasAttribute('title')) {
        attrs.set('title', element.getAttribute('title') || '');
      }
      if (element.hasAttribute('alt')) {
        attrs.set('alt', element.getAttribute('alt') || '');
      }
      if (element.hasAttribute('aria-label')) {
        attrs.set('aria-label', element.getAttribute('aria-label') || '');
      }

      if (attrs.size > 0) {
        this.originalAttributes.set(element, attrs);
      }
    });
  }

  private collectTexts(): string[] {
    const texts: string[] = [];

    // Collect from stored original texts
    this.originalTexts.forEach((text) => {
      if (!texts.includes(text)) {
        texts.push(text);
      }
    });

    // Collect from attributes
    this.originalAttributes.forEach((attrs) => {
      attrs.forEach((value) => {
        if (!texts.includes(value)) {
          texts.push(value);
        }
      });
    });

    return texts;
  }

  private async translateBatch(texts: string[], targetLang: string): Promise<Map<string, string>> {
    const translations = new Map<string, string>();

    // Check cache first
    let langCache = this.translationCache.get(targetLang);
    if (!langCache) {
      langCache = new Map<string, string>();
      this.translationCache.set(targetLang, langCache);
    }

    // Filter out already cached translations
    const textsToTranslate = texts.filter(text => !langCache.has(text));

    if (textsToTranslate.length > 0) {
      try {
        // Call translation API in chunks
        const chunkSize = 50;
        for (let i = 0; i < textsToTranslate.length; i += chunkSize) {
          const chunk = textsToTranslate.slice(i, i + chunkSize);

          const response = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              texts: chunk,
              targetLang,
              sourceLang: 'en'
            })
          });

          const result = await response.json();

          if (result.success && result.translations) {
            chunk.forEach((text, index) => {
              const translation = result.translations[index] || text;
              langCache.set(text, translation);
              translations.set(text, translation);
            });
          }
        }
      } catch (error) {
        console.error('Translation API error:', error);
      }
    }

    // Add cached translations
    texts.forEach(text => {
      const cached = langCache.get(text);
      if (cached) {
        translations.set(text, cached);
      } else {
        translations.set(text, text); // Fallback to original
      }
    });

    return translations;
  }

  private applyTranslations(translations: Map<string, string>, targetLang: string) {
    // Apply to text nodes
    this.originalTexts.forEach((originalText, node) => {
      const translation = translations.get(originalText);
      if (translation && node.textContent !== translation) {
        node.textContent = translation;
      }
    });

    // Apply to attributes
    this.originalAttributes.forEach((attrs, element) => {
      attrs.forEach((originalValue, attrName) => {
        const translation = translations.get(originalValue);
        if (translation) {
          element.setAttribute(attrName, translation);
        }
      });
    });
  }

  private restoreOriginal() {
    this.stopObserver();

    // Restore text nodes
    this.originalTexts.forEach((originalText, node) => {
      if (node.textContent !== originalText) {
        node.textContent = originalText;
      }
    });

    // Restore attributes
    this.originalAttributes.forEach((attrs, element) => {
      attrs.forEach((originalValue, attrName) => {
        element.setAttribute(attrName, originalValue);
      });
    });

    // Clear stored data
    this.originalTexts.clear();
    this.originalAttributes.clear();
  }

  private startObserver(targetLang: string) {
    if (this.observer) return;

    this.observer = new MutationObserver(async (mutations) => {
      if (this.isTranslating) return;

      const newTexts = new Set<string>();
      const newNodes = new Map<Node, string>();

      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
              const text = node.textContent?.trim();
              if (text && text.length > 0) {
                newTexts.add(text);
                newNodes.set(node, text);
                // Store as original
                this.originalTexts.set(node, text);
              }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
              // Process text nodes within element
              const walker = document.createTreeWalker(
                node,
                NodeFilter.SHOW_TEXT,
                {
                  acceptNode: (n) => {
                    const parent = n.parentElement;
                    if (!parent) return NodeFilter.FILTER_REJECT;
                    const tagName = parent.tagName;
                    if (tagName === 'SCRIPT' || tagName === 'STYLE') {
                      return NodeFilter.FILTER_REJECT;
                    }
                    const text = n.textContent?.trim();
                    if (text && text.length > 0) {
                      return NodeFilter.FILTER_ACCEPT;
                    }
                    return NodeFilter.FILTER_REJECT;
                  }
                }
              );

              let textNode;
              while (textNode = walker.nextNode()) {
                const text = textNode.textContent?.trim();
                if (text) {
                  newTexts.add(text);
                  newNodes.set(textNode, text);
                  // Store as original
                  this.originalTexts.set(textNode, text);
                }
              }
            }
          });
        }
      });

      // Translate new texts
      if (newTexts.size > 0) {
        const textsArray = Array.from(newTexts);
        const translations = await this.translateBatch(textsArray, targetLang);

        // Apply translations to new nodes
        newNodes.forEach((originalText, node) => {
          const translation = translations.get(originalText);
          if (translation && node.textContent !== translation) {
            node.textContent = translation;
          }
        });
      }
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: false,
      attributes: false
    });
  }

  private stopObserver() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  public getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  public isActive(): boolean {
    return this.currentLanguage !== 'en';
  }
}

// Create singleton instance
export const translationService = new TranslationService();