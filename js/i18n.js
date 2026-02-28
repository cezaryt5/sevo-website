/**
 * SEVO Lightweight Internationalization System
 * Zero dependencies, pure vanilla JavaScript
 * Supports English and Arabic with RTL layout
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        defaultLang: 'en',
        supportedLangs: ['en', 'ar'],
        storageKey: 'sevo-language',
        rtlLangs: ['ar']
    };

    // Translation data will be loaded dynamically
    let translations = {};
    let currentLang = CONFIG.defaultLang;

    /**
     * Get stored language preference or default
     */
    function getStoredLanguage() {
        try {
            const stored = localStorage.getItem(CONFIG.storageKey);
            if (stored && CONFIG.supportedLangs.includes(stored)) {
                return stored;
            }
        } catch (e) {
            // localStorage not available (private mode, etc.)
        }
        
        // Check browser language
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0];
        
        if (CONFIG.supportedLangs.includes(langCode)) {
            return langCode;
        }
        
        return CONFIG.defaultLang;
    }

    /**
     * Store language preference
     */
    function storeLanguage(lang) {
        try {
            localStorage.setItem(CONFIG.storageKey, lang);
        } catch (e) {
            // localStorage not available
        }
    }

    /**
     * Load translation file
     */
    async function loadTranslations(lang) {
        try {
            const response = await fetch(`js/translations/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load translations for ${lang}`);
            }
            translations = await response.json();
            return true;
        } catch (error) {
            console.warn('SEVO i18n: Could not load translations, using fallback', error);
            translations = {};
            return false;
        }
    }

    /**
     * Get nested translation value
     */
    function getTranslation(key, fallback) {
        const keys = key.split('.');
        let value = translations;
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return fallback || key;
            }
        }
        
        return value || fallback || key;
    }

    /**
     * Update all translatable elements on the page
     */
    function updatePageContent() {
        // Update elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const fallback = element.textContent;
            const translation = getTranslation(key, fallback);
            
            // Check if HTML content is allowed
            if (element.hasAttribute('data-i18n-html')) {
                element.innerHTML = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const fallback = element.getAttribute('placeholder') || '';
            element.setAttribute('placeholder', getTranslation(key, fallback));
        });

        // Update title
        const titleElement = document.querySelector('title[data-i18n-title]');
        if (titleElement) {
            const key = titleElement.getAttribute('data-i18n-title');
            const fallback = titleElement.textContent;
            document.title = getTranslation(key, fallback);
        }

        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"][data-i18n-content]');
        if (metaDesc) {
            const key = metaDesc.getAttribute('data-i18n-content');
            const fallback = metaDesc.getAttribute('content') || '';
            metaDesc.setAttribute('content', getTranslation(key, fallback));
        }

        // Update lang attribute on html element
        document.documentElement.setAttribute('lang', currentLang);

        // Handle RTL
        updateDirection();

        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('i18n:updated', { 
            detail: { lang: currentLang } 
        }));
    }

    /**
     * Update text direction for RTL languages
     */
    function updateDirection() {
        const isRTL = CONFIG.rtlLangs.includes(currentLang);
        document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
        
        if (isRTL) {
            document.body.classList.add('rtl');
            document.body.classList.remove('ltr');
        } else {
            document.body.classList.add('ltr');
            document.body.classList.remove('rtl');
        }
    }

    /**
     * Switch language
     */
    async function switchLanguage(lang) {
        if (!CONFIG.supportedLangs.includes(lang) || lang === currentLang) {
            return false;
        }

        currentLang = lang;
        storeLanguage(lang);
        
        await loadTranslations(lang);
        updatePageContent();
        updateLanguageSwitcher();
        
        return true;
    }

    /**
     * Update language switcher UI
     */
    function updateLanguageSwitcher() {
        document.querySelectorAll('.lang-switcher').forEach(switcher => {
            switcher.querySelectorAll('.lang-btn').forEach(btn => {
                const btnLang = btn.getAttribute('data-lang');
                btn.classList.toggle('active', btnLang === currentLang);
                btn.setAttribute('aria-pressed', btnLang === currentLang);
            });
        });
    }

    /**
     * Initialize language switcher events
     */
    function initLanguageSwitcher() {
        document.querySelectorAll('.lang-switcher').forEach(switcher => {
            switcher.querySelectorAll('.lang-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    const lang = btn.getAttribute('data-lang');
                    await switchLanguage(lang);
                });
            });
        });
    }

    /**
     * Format numbers according to locale
     */
    function formatNumber(number, options = {}) {
        const locale = currentLang === 'ar' ? 'ar-SD' : 'en-US';
        return new Intl.NumberFormat(locale, options).format(number);
    }

    /**
     * Format dates according to locale
     */
    function formatDate(date, options = {}) {
        const locale = currentLang === 'ar' ? 'ar-SD' : 'en-US';
        const defaultOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(date);
    }

    /**
     * Initialize the i18n system
     */
    async function init() {
        currentLang = getStoredLanguage();
        await loadTranslations(currentLang);
        updatePageContent();
        initLanguageSwitcher();
        updateLanguageSwitcher();

        // Make API available globally
        window.SEVO = window.SEVO || {};
        window.SEVO.i18n = {
            switchLanguage,
            getCurrentLang: () => currentLang,
            getSupportedLangs: () => CONFIG.supportedLangs,
            t: getTranslation,
            formatNumber,
            formatDate,
            isRTL: () => CONFIG.rtlLangs.includes(currentLang)
        };

        console.log(`SEVO i18n initialized: ${currentLang}`);
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
