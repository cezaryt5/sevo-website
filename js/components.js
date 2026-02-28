/**
 * SEVO Shared Components Loader
 * Loads shared UI components across all pages
 * Zero dependencies
 */

(function() {
    'use strict';

    // Component definitions
    const COMPONENTS = {
        // Language Switcher Component
        languageSwitcher: `
            <div class="lang-switcher" role="group" aria-label="Select language">
                <button class="lang-btn" data-lang="en" aria-label="English" title="English">
                    <span class="lang-flag">🇬🇧</span>
                    <span class="lang-code">EN</span>
                </button>
                <button class="lang-btn" data-lang="ar" aria-label="العربية" title="العربية">
                    <span class="lang-flag">🇸🇩</span>
                    <span class="lang-code">AR</span>
                </button>
            </div>
        `,

    };

    /**
     * Insert language switcher into header/navbar areas
     * Places switcher in nav-actions container for direction-aware layout
     */
    function insertLanguageSwitcher() {
        // Add to floating navbar's nav-actions container
        const floatingActions = document.querySelectorAll('.navbar .nav-actions');
        floatingActions.forEach(actions => {
            if (!actions.querySelector('.lang-switcher')) {
                const switcher = document.createElement('div');
                switcher.innerHTML = COMPONENTS.languageSwitcher;
                actions.insertBefore(switcher.firstElementChild, actions.firstChild);
            }
        });

        // Add to static header's nav-actions container
        const staticActions = document.querySelectorAll('.static-header .nav-actions');
        staticActions.forEach(actions => {
            if (!actions.querySelector('.lang-switcher')) {
                const switcher = document.createElement('div');
                switcher.innerHTML = COMPONENTS.languageSwitcher;
                actions.insertBefore(switcher.firstElementChild, actions.firstChild);
            }
        });

        // Fallback: Add to nav-links for backward compatibility with legacy layouts
        const fallbackNavs = document.querySelectorAll('.navbar .nav-links, .static-header .nav-links');
        fallbackNavs.forEach(nav => {
            if (!nav.querySelector('.lang-switcher') && !nav.closest('nav').querySelector('.nav-actions')) {
                const switcher = document.createElement('div');
                switcher.innerHTML = COMPONENTS.languageSwitcher;
                nav.insertBefore(switcher.firstElementChild, nav.firstChild);
            }
        });
    }

    /**
     * Mark main content area
     */
    function markMainContent() {
        const main = document.querySelector('main');
        if (main && !main.id) {
            main.id = 'main-content';
        }
    }

    /**
     * Initialize all components
     */
    function init() {
        markMainContent();
        insertLanguageSwitcher();
        
        console.log('SEVO components initialized');
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose API
    window.SEVO = window.SEVO || {};
    window.SEVO.components = {
        refresh: init,
        insertLanguageSwitcher
    };
})();
