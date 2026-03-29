/**
 * SEVO Form Protection System
 * Cloudflare Turnstile + Rate limiting
 * Works with static sites (GitHub Pages)
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        // Cloudflare Turnstile Site Key
        turnstileSiteKey: '0x4AAAAAACxkmBsUnLxxDRbi',

        // Rate limiting: milliseconds between submissions
        contactFormCooldown: 60000, // 1 minute
        newsletterCooldown: 300000, // 5 minutes

        // Storage keys
        storageKeys: {
            contactLastSubmit: 'sevo_contact_last_submit',
            newsletterLastSubmit: 'sevo_newsletter_last_submit',
            contactAttempts: 'sevo_contact_attempts',
            newsletterAttempts: 'sevo_newsletter_attempts'
        },

        // Max attempts before temporary block
        maxAttempts: 5,
        blockDuration: 300000 // 5 minutes
    };

    /**
     * Check if Turnstile token exists
     */
    function checkTurnstile(form) {
        const tokenInput = form.querySelector('[name="cf-turnstile-response"]');
        
        if (!tokenInput || !tokenInput.value) {
            return {
                valid: false,
                message: 'Please complete the security verification.'
            };
        }

        return { valid: true };
    }

    /**
     * Reset Turnstile widget
     */
    function resetTurnstile(form) {
        const widgetContainer = form.querySelector('.cf-turnstile');
        if (widgetContainer && window.turnstile) {
            const widgetId = widgetContainer.getAttribute('data-widget-id');
            if (widgetId) {
                window.turnstile.reset(widgetId);
            }
        }
    }

    /**
     * Check rate limit for a form
     */
    function checkRateLimit(formType) {
        const storageKey = CONFIG.storageKeys[formType + 'LastSubmit'];
        const attemptsKey = CONFIG.storageKeys[formType + 'Attempts'];
        const cooldown = formType === 'contact' ? CONFIG.contactFormCooldown : CONFIG.newsletterCooldown;

        try {
            const lastSubmit = parseInt(localStorage.getItem(storageKey) || '0', 10);
            const attempts = parseInt(localStorage.getItem(attemptsKey) || '0', 10);
            const now = Date.now();

            // Check if blocked due to too many attempts
            if (attempts >= CONFIG.maxAttempts) {
                const blockKey = formType + 'BlockTime';
                const blockTime = parseInt(localStorage.getItem(blockKey) || '0', 10);
                
                if (blockTime && now - blockTime < CONFIG.blockDuration) {
                    const remaining = Math.ceil((CONFIG.blockDuration - (now - blockTime)) / 1000);
                    return {
                        allowed: false,
                        reason: 'blocked',
                        message: `Too many attempts. Please try again in ${remaining} seconds.`,
                        remainingTime: remaining
                    };
                } else {
                    // Reset attempts after block duration
                    localStorage.setItem(attemptsKey, '0');
                }
            }

            // Check cooldown
            if (now - lastSubmit < cooldown) {
                const remaining = Math.ceil((cooldown - (now - lastSubmit)) / 1000);
                return {
                    allowed: false,
                    reason: 'cooldown',
                    message: `Please wait ${remaining} seconds before submitting again.`,
                    remainingTime: remaining
                };
            }

            return { allowed: true };
        } catch (e) {
            // localStorage not available, allow submission
            return { allowed: true };
        }
    }

    /**
     * Record successful submission
     */
    function recordSubmission(formType) {
        const storageKey = CONFIG.storageKeys[formType + 'LastSubmit'];
        const attemptsKey = CONFIG.storageKeys[formType + 'Attempts'];
        
        try {
            localStorage.setItem(storageKey, Date.now().toString());
            localStorage.setItem(attemptsKey, '0'); // Reset attempts on success
        } catch (e) {
            // localStorage not available
        }
    }

    /**
     * Record failed attempt
     */
    function recordFailedAttempt(formType) {
        const attemptsKey = CONFIG.storageKeys[formType + 'Attempts'];
        const blockKey = formType + 'BlockTime';
        
        try {
            const attempts = parseInt(localStorage.getItem(attemptsKey) || '0', 10) + 1;
            localStorage.setItem(attemptsKey, attempts.toString());
            
            if (attempts >= CONFIG.maxAttempts) {
                localStorage.setItem(blockKey, Date.now().toString());
            }
        } catch (e) {
            // localStorage not available
        }
    }

    /**
     * Validate honeypot field (should be empty)
     */
    function validateHoneypot(form) {
        const honeypot = form.querySelector('.honeypot-field');
        
        if (honeypot && honeypot.value.trim() !== '') {
            // Bot detected - silently fail
            console.warn('Bot detected via honeypot');
            return { valid: false, isBot: true };
        }

        return { valid: true };
    }

    /**
     * Show error message
     */
    function showError(form, message) {
        let errorEl = form.querySelector('.form-error');
        
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.className = 'form-error';
            errorEl.style.cssText = 'background: #fee; color: #c00; padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; font-size: 0.9rem;';
            form.insertBefore(errorEl, form.firstChild);
        }

        errorEl.textContent = message;
        errorEl.style.display = 'block';

        setTimeout(() => {
            errorEl.style.display = 'none';
        }, 5000);
    }

    /**
     * Show success message
     */
    function showSuccess(form, message) {
        let successEl = form.querySelector('.form-success');
        
        if (!successEl) {
            successEl = document.createElement('div');
            successEl.className = 'form-success';
            successEl.style.cssText = 'background: #efe; color: #060; padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; font-size: 0.9rem;';
            form.insertBefore(successEl, form.firstChild);
        }

        successEl.textContent = message;
        successEl.style.display = 'block';
    }

    /**
     * Initialize contact form protection
     */
    function initContactForm() {
        const form = document.querySelector('form[action="#"]');
        if (!form) return;

        // Add honeypot field
        const honeypot = document.createElement('input');
        honeypot.type = 'text';
        honeypot.name = 'website_url';
        honeypot.className = 'honeypot-field';
        honeypot.style.cssText = 'position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden;';
        honeypot.setAttribute('tabindex', '-1');
        honeypot.setAttribute('autocomplete', 'off');
        form.appendChild(honeypot);

        // Add Cloudflare Turnstile before submit button
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            const turnstileContainer = document.createElement('div');
            turnstileContainer.className = 'cf-turnstile';
            turnstileContainer.style.cssText = 'margin-bottom: 16px;';
            turnstileContainer.setAttribute('data-sitekey', CONFIG.turnstileSiteKey);
            turnstileContainer.setAttribute('data-theme', 'light');
            turnstileContainer.setAttribute('data-size', 'normal');
            submitBtn.parentNode.insertBefore(turnstileContainer, submitBtn);
        }

        // Form submission handler
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validate honeypot
            const honeypotCheck = validateHoneypot(form);
            if (!honeypotCheck.valid) {
                // Silently ignore bot submissions
                return;
            }

            // Check rate limit
            const rateLimit = checkRateLimit('contact');
            if (!rateLimit.allowed) {
                showError(form, rateLimit.message);
                recordFailedAttempt('contact');
                return;
            }

            // Validate Turnstile
            const turnstileCheck = checkTurnstile(form);
            if (!turnstileCheck.valid) {
                showError(form, turnstileCheck.message);
                return;
            }

            // All checks passed - proceed with form submission
            showSuccess(form, '✓ Message sent successfully! We\'ll get back to you soon.');
            recordSubmission('contact');
            form.reset();
            resetTurnstile(form);

            // TODO: Add your actual form submission logic here
            // Example: Send to Formspree, EmailJS, or your backend
        });
    }

    /**
     * Initialize newsletter form protection
     */
    function initNewsletterForm() {
        const forms = document.querySelectorAll('#newsletterForm');
        
        forms.forEach(form => {
            // Add honeypot field
            const honeypot = document.createElement('input');
            honeypot.type = 'text';
            honeypot.name = 'website';
            honeypot.className = 'honeypot-field';
            honeypot.style.cssText = 'position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden;';
            honeypot.setAttribute('tabindex', '-1');
            honeypot.setAttribute('autocomplete', 'off');
            form.appendChild(honeypot);

            // Add Cloudflare Turnstile before submit button
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                const turnstileContainer = document.createElement('div');
                turnstileContainer.className = 'cf-turnstile';
                turnstileContainer.style.cssText = 'margin: 12px 0; display: flex; justify-content: center;';
                turnstileContainer.setAttribute('data-sitekey', CONFIG.turnstileSiteKey);
                turnstileContainer.setAttribute('data-theme', 'light');
                turnstileContainer.setAttribute('data-size', 'compact');
                submitBtn.parentNode.insertBefore(turnstileContainer, submitBtn);
            }

            // Form submission handler
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                const emailInput = form.querySelector('input[type="email"]');
                if (!emailInput || !emailInput.value) {
                    showError(form, 'Please enter a valid email address.');
                    return;
                }

                // Validate honeypot
                const honeypotCheck = validateHoneypot(form);
                if (!honeypotCheck.valid) {
                    // Silently ignore bot submissions
                    return;
                }

                // Check rate limit
                const rateLimit = checkRateLimit('newsletter');
                if (!rateLimit.allowed) {
                    showError(form, rateLimit.message);
                    recordFailedAttempt('newsletter');
                    return;
                }

                // Validate Turnstile
                const turnstileCheck = checkTurnstile(form);
                if (!turnstileCheck.valid) {
                    showError(form, turnstileCheck.message);
                    return;
                }

                // All checks passed - proceed with newsletter subscription
                showSuccess(form, '✓ Thank you for subscribing!');
                recordSubmission('newsletter');
                form.style.display = 'none';
                
                const successEl = document.getElementById('newsletterSuccess');
                if (successEl) {
                    successEl.style.display = 'block';
                }

                // TODO: Add your actual newsletter submission logic here
                // Example: Send to Mailchimp, Formspree, or your backend
            });
        });
    }

    /**
     * Initialize donation form protection
     */
    function initDonationForm() {
        const donateBtn = document.querySelector('#donation-form .btn');
        if (!donateBtn) return;

        donateBtn.addEventListener('click', function(e) {
            e.preventDefault();

            // Check rate limit
            const rateLimit = checkRateLimit('contact');
            if (!rateLimit.allowed) {
                alert(rateLimit.message);
                recordFailedAttempt('contact');
                return;
            }

            // For donation form, just show a message
            // You would integrate with a payment processor here
            alert('Thank you for your interest in donating! Please contact us at umsima1167@gmail.com to complete your donation.');
            recordSubmission('contact');
        });
    }

    /**
     * Initialize all form protections
     */
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                initContactForm();
                initNewsletterForm();
                initDonationForm();
            });
        } else {
            initContactForm();
            initNewsletterForm();
            initDonationForm();
        }

        console.log('SEVO Form Protection initialized');
    }

    // Auto-initialize
    init();

    // Expose API for manual control
    window.SEVO = window.SEVO || {};
    window.SEVO.forms = {
        checkRateLimit,
        recordSubmission,
        recordFailedAttempt,
        checkTurnstile,
        resetTurnstile,
        CONFIG
    };
})();
