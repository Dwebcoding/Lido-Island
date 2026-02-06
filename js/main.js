// Gestione chip informativi espandibili (hover/click/tap)
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.info-chip').forEach(function(chip) {
        // Espansione su click/tap (mobile)
        chip.addEventListener('click', function(e) {
            // Chiudi altri chip
            document.querySelectorAll('.info-chip.expanded').forEach(function(other) {
                if (other !== chip) other.classList.remove('expanded');
            });
            chip.classList.toggle('expanded');
        });
        // Espansione su tastiera (Enter/Space)
        chip.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                chip.click();
            }
        });
        // Chiudi su click fuori
        document.addEventListener('click', function(e) {
            if (!chip.contains(e.target)) chip.classList.remove('expanded');
        });
    });
});
/* ============================================
   ISOLA LIDO - JAVASCRIPT PRINCIPALE
   Author: Web Developer Professionista
   Versione: 1.0
   ============================================ */

// ============ MENU MOBILE TOGGLE ============

/**
 * Inizializza il toggle del menu hamburger
 * Consente di mostrare/nascondere il menu su dispositivi mobili
 */
function initMenuToggle() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (!menuToggle || !navMenu) return;

    // Evita di agganciare più volte gli stessi listener quando il componente viene reinizializzato
    if (menuToggle.dataset.bound === 'true') return;
    menuToggle.dataset.bound = 'true';

    const setMenuState = (isOpen) => {
        navMenu.classList.toggle('active', isOpen);
        menuToggle.classList.toggle('active', isOpen);
        document.body.classList.toggle('nav-open', isOpen);
        menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    };

    const closeMenu = () => setMenuState(false);

    // Toggle del menu al click del bottone hamburger
    menuToggle.addEventListener('click', function(event) {
        event.stopPropagation();
        const isOpen = !navMenu.classList.contains('active');
        setMenuState(isOpen);
    });

    // Chiude il menu quando si clicca su un link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Chiude il menu quando si clicca fuori
    document.addEventListener('click', function(event) {
        const isClickInsideMenu = navMenu.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnToggle && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
}

// ============ CONSENSO COOKIE/PRIVACY ============
const CONSENT_KEY = 'isolaLidoConsent';

function getStoredConsent() {
    try {
        const raw = localStorage.getItem(CONSENT_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        console.warn('Impossibile leggere il consenso salvato', e);
        return null;
    }
}

function saveConsent(consent) {
    try {
        localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    } catch (e) {
        console.warn('Impossibile salvare il consenso', e);
    }
}

function applyConsent(consent) {
    document.documentElement.setAttribute('data-consent-analytics', consent.analytics);
    document.documentElement.setAttribute('data-consent-marketing', consent.marketing);
    // Qui potresti inizializzare/ bloccare script di terze parti in base al consenso
}

function renderConsentUI() {
    if (document.getElementById('cookieBanner')) return;

    const banner = document.createElement('div');
    banner.id = 'cookieBanner';
    banner.className = 'cookie-banner';
    banner.innerHTML = `
        <div class="cookie-banner__content">
            <div class="cookie-banner__text">
                Usiamo cookie tecnici e, con il tuo consenso, cookie di statistica e marketing per migliorare l'esperienza. 
                Leggi la <a href="html/cookie.html">Cookie Policy</a> e la <a href="html/privacy.html">Privacy Policy</a>.
            </div>
            <div class="cookie-banner__actions">
                <button class="secondary-button ghost" id="cookieReject">Rifiuta</button>
                <button class="secondary-button" id="cookiePrefs">Gestisci</button>
                <button class="primary-button" id="cookieAccept">Accetta tutti</button>
            </div>
        </div>
    `;

    const modal = document.createElement('div');
    modal.id = 'cookieModal';
    modal.className = 'consent-modal';
    modal.innerHTML = `
        <div class="consent-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="consentTitle">
            <div class="consent-modal__header">
                <h3 id="consentTitle">Preferenze cookie</h3>
                <button class="consent-modal__close" id="cookieModalClose" aria-label="Chiudi">×</button>
            </div>
            <div class="consent-modal__body">
                <label class="consent-toggle">
                    <input type="checkbox" checked disabled>
                    <span>Cookie tecnici necessari (sempre attivi)</span>
                </label>
                <label class="consent-toggle">
                    <input type="checkbox" id="consentAnalytics">
                    <span>Cookie di statistica/analitici</span>
                </label>
                <label class="consent-toggle">
                    <input type="checkbox" id="consentMarketing">
                    <span>Cookie di marketing</span>
                </label>
            </div>
            <div class="consent-modal__footer">
                <button class="secondary-button" id="cookieModalReject">Rifiuta non essenziali</button>
                <button class="primary-button" id="cookieModalSave">Salva preferenze</button>
            </div>
        </div>
    `;

    document.body.appendChild(banner);
    document.body.appendChild(modal);

    const stored = getStoredConsent();
    if (stored) {
        document.getElementById('consentAnalytics').checked = !!stored.analytics;
        document.getElementById('consentMarketing').checked = !!stored.marketing;
        banner.classList.add('is-hidden');
    }

    const hideModal = () => modal.classList.remove('open');
    document.getElementById('cookiePrefs').addEventListener('click', () => {
        modal.classList.add('open');
    });
    document.getElementById('cookieModalClose').addEventListener('click', hideModal);
    document.getElementById('cookieModalReject').addEventListener('click', () => {
        const consent = { necessary: true, analytics: false, marketing: false, ts: Date.now() };
        saveConsent(consent);
        applyConsent(consent);
        hideModal();
        banner.classList.add('is-hidden');
    });
    document.getElementById('cookieModalSave').addEventListener('click', () => {
        const consent = {
            necessary: true,
            analytics: document.getElementById('consentAnalytics').checked,
            marketing: document.getElementById('consentMarketing').checked,
            ts: Date.now()
        };
        saveConsent(consent);
        applyConsent(consent);
        hideModal();
        banner.classList.add('is-hidden');
    });
    document.getElementById('cookieAccept').addEventListener('click', () => {
        const consent = { necessary: true, analytics: true, marketing: true, ts: Date.now() };
        document.getElementById('consentAnalytics').checked = true;
        document.getElementById('consentMarketing').checked = true;
        saveConsent(consent);
        applyConsent(consent);
        banner.classList.add('is-hidden');
        hideModal();
    });
    document.getElementById('cookieReject').addEventListener('click', () => {
        const consent = { necessary: true, analytics: false, marketing: false, ts: Date.now() };
        document.getElementById('consentAnalytics').checked = false;
        document.getElementById('consentMarketing').checked = false;
        saveConsent(consent);
        applyConsent(consent);
        banner.classList.add('is-hidden');
        hideModal();
    });

    const footerConsent = document.getElementById('openConsent');
    if (footerConsent) {
        footerConsent.addEventListener('click', () => {
            document.getElementById('cookiePrefs').click();
        });
    }
}

function initConsentManager() {
    renderConsentUI();
    const consent = getStoredConsent();
    if (consent) {
        applyConsent(consent);
    }
}

// ============ GESTIONE LINK ATTIVI ============

/**
 * Aggiorna i link attivi della navigazione in base alla pagina corrente
 */
function updateActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href').split('/').pop() || 'index.html';
        
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ============ VALIDAZIONE FORM CONTATTI ============

/**
 * Valida un indirizzo email
 * @param {string} email - L'email da validare
 * @returns {boolean} - True se email valida
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Valida il form di contatto
 * @param {HTMLFormElement} form - Il form da validare
 * @returns {boolean} - True se il form è valido
 */
function validateContactForm(form) {
    // Resetta gli errori precedenti
    form.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
    });

    let isValid = true;

    // Valida Nome
    const nameInput = form.querySelector('input[name="nome"]');
    if (!nameInput || nameInput.value.trim().length < 2) {
        if (nameInput) {
            markFieldAsError(nameInput, 'Il nome deve contenere almeno 2 caratteri');
            isValid = false;
        }
    }

    // Valida Email
    const emailInput = form.querySelector('input[name="email"]');
    if (!emailInput || !validateEmail(emailInput.value.trim())) {
        if (emailInput) {
            markFieldAsError(emailInput, 'Inserisci un email valido');
            isValid = false;
        }
    }

    // Valida Messaggio
    const messageInput = form.querySelector('textarea[name="messaggio"]');
    if (!messageInput || messageInput.value.trim().length < 5) {
        if (messageInput) {
            markFieldAsError(messageInput, 'Il messaggio deve contenere almeno 5 caratteri');
            isValid = false;
        }
    }

    return isValid;
}

/**
 * Marca un campo come contenente un errore
 * @param {HTMLElement} field - Il campo del form
 * @param {string} message - Il messaggio di errore
 */
function markFieldAsError(field, message) {
    const formGroup = field.closest('.form-group');
    if (formGroup) {
        formGroup.classList.add('error');
        let errorElement = formGroup.querySelector('.form-error');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'form-error';
            formGroup.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }
}

/**
 * Inizializza il form di contatto
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Valida il form
        if (!validateContactForm(contactForm)) {
            return;
        }

        // Se il form è valido, mostra il messaggio di successo
        showFormSuccess(contactForm);

        // Resetta il form dopo 2 secondi
        setTimeout(() => {
            contactForm.reset();
            hideFormSuccess(contactForm);
        }, 2000);
    });

    // Rimuove i messaggi di errore quando l'utente inizia a digitare
    contactForm.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('input', function() {
            const formGroup = this.closest('.form-group');
            if (formGroup && formGroup.classList.contains('error')) {
                formGroup.classList.remove('error');
            }
        });
    });
}

/**
 * Mostra il messaggio di successo del form
 * @param {HTMLFormElement} form - Il form
 */
function showFormSuccess(form) {
    let successElement = form.querySelector('.form-success');
    if (!successElement) {
        successElement = document.createElement('div');
        successElement.className = 'form-success';
        successElement.textContent = '✓ Messaggio inviato con successo! Ti contatteremo presto.';
        form.insertBefore(successElement, form.firstChild);
    }
    successElement.classList.add('show');
}

/**
 * Nasconde il messaggio di successo del form
 * @param {HTMLFormElement} form - Il form
 */
function hideFormSuccess(form) {
    const successElement = form.querySelector('.form-success');
    if (successElement) {
        successElement.classList.remove('show');
    }
}

// ============ ANIMAZIONI SCROLL ============

/**
 * Aggiunge animazioni agli elementi quando entrano in vista
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Osserva i sezioni principali
    const sections = document.querySelectorAll('.gallery-section, .about-section, .services-preview');
    sections.forEach(section => {
        observer.observe(section);
    });
}

// ============ SMOOTH SCROLL PER LINK ANCHOR ============

/**
 * Gestisce lo smooth scroll per i link anchor
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============ HOVER EFFECT PER CARD ============

/**
 * Aggiunge effetti hover alle card di servizi
 */
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.service-card, .gallery-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
}


// ============ UTILITY: LOGGER ============

/**
 * Logger per il debugging (in fase di sviluppo)
 * @param {string} message - Il messaggio da loggare
 * @param {*} data - I dati da loggare (opzionale)
 */
function log(message, data = null) {
    if (data) {
        console.log(`[Isola Lido] ${message}`, data);
    } else {
        console.log(`[Isola Lido] ${message}`);
    }
}

// ============ INIZIALIZZAZIONE PRINCIPALE ============

/**
 * Anima i numeri del counter stats
 */
function initCounterAnimation() {
    const stats = document.querySelectorAll('.stat-number');
    let animated = false;

    function animateCounter() {
        stats.forEach((stat, index) => {
            const target = parseInt(stat.getAttribute('data-target'));
            const increment = target / 40; // 40 frames di animazione
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target;
                }
            };

            // Stagger animation per ogni card
            setTimeout(() => {
                updateCounter();
            }, index * 100);
        });
    }

    // Intersection Observer per attivare l'animazione quando la sezione è visibile
    const heroSection = document.querySelector('.glassmorphism-hero, .wave-hero, .mesh-hero');
    if (heroSection && !animated) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !animated) {
                animated = true;
                animateCounter();
                observer.unobserve(heroSection);
            }
        }, { threshold: 0.3 });

        observer.observe(heroSection);
    }
}

/**
 * Inizializza tutti i componenti JavaScript
 * Viene eseguita quando il DOM è completamente caricato
 */
function initializeApp() {
    log('Applicazione in fase di caricamento...');

    // Inizializza i componenti
    initConsentManager();
    initMenuToggle();
    updateActiveNavLink();
    initContactForm();
    initScrollAnimations();
    initSmoothScroll();
    initCardHoverEffects();
    initCounterAnimation();
    initBookingForm();

    log('Applicazione caricata con successo!');
}

// Attende che il DOM sia completamente caricato
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // Se il DOM è già caricato
    initializeApp();
}

// ============ EVENT LISTENER PER RESIZE ============

/**
 * Aggiorna il layout quando la finestra viene ridimensionata
 */
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        updateActiveNavLink();
    }, 250);
});

function initBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    if (!bookingForm) return;

    // Evita di agganciare più volte il listener se la pagina viene reinizializzata
    if (bookingForm.dataset.bound === 'true') return;
    bookingForm.dataset.bound = 'true';

    // Delego la logica di invio/validazione al booking.js
    bookingForm.addEventListener('submit', function(e) {
        if (typeof handleBookingSubmit === 'function') {
            handleBookingSubmit(e);
        }
    });
}
