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

    // Toggle del menu al click del bottone hamburger
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Chiude il menu quando si clicca su un link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });

    // Chiude il menu quando si clicca fuori
    document.addEventListener('click', function(event) {
        const isClickInsideMenu = navMenu.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnToggle && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
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
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const increment = target / 30; // 30 frames di animazione
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

            updateCounter();
        });
    }

    // Intersectino Observer per attivare l'animazione quando la sezione è visibile
    const waveHero = document.querySelector('.wave-hero');
    if (waveHero && !animated) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !animated) {
                animated = true;
                animateCounter();
                observer.unobserve(waveHero);
            }
        }, { threshold: 0.5 });

        observer.observe(waveHero);
    }
}

/**
 * Inizializza tutti i componenti JavaScript
 * Viene eseguita quando il DOM è completamente caricato
 */
function initializeApp() {
    log('Applicazione in fase di caricamento...');

    // Inizializza i componenti
    initMenuToggle();
    updateActiveNavLink();
    initContactForm();
    initScrollAnimations();
    initSmoothScroll();
    initCardHoverEffects();
    initCounterAnimation();

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
