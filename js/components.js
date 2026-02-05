/* ============================================
   ISOLA LIDO - COMPONENTI CONDIVISI
   Header e Footer dinamici per tutte le pagine
   Author: Web Developer Professionista
   ============================================ */

/**
 * Renderizza l'header (navbar) in tutte le pagine
 * @param {string} activePage - Nome della pagina attiva (es: 'home', 'servizi', 'prenotazioni', 'contatti')
 */
function renderHeader(activePage = 'home') {
    const headerHTML = `
        <div class="header-container">
            <div class="logo-section">
                <a class="brand-block" aria-label="Isola Lido" href="${getHomePath()}">
                    <h1 class="brand-name"><span class="brand-main">Isola</span><span class="brand-highlight">Lido</span></h1>
                    <span class="brand-tagline">Pool · Grill · Relax</span>
                </a>
            </div>
            
            <button class="menu-toggle" id="menuToggle" aria-label="Toggle menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
            
            <nav class="nav" id="navMenu">
                <ul class="nav-list">
                    <li><a href="${getHomePath()}" class="nav-link ${activePage === 'home' ? 'active' : ''}">Home</a></li>
                    <li><a href="${getServicesPath()}" class="nav-link ${activePage === 'servizi' ? 'active' : ''}">Servizi</a></li>
                    <li><a href="${getBookingsPath()}" class="nav-link ${activePage === 'prenotazioni' ? 'active' : ''}">Prenotazioni</a></li>
                    <li><a href="${getContactsPath()}" class="nav-link ${activePage === 'contatti' ? 'active' : ''}">Contatti</a></li>
                </ul>
            </nav>
        </div>
    `;
    
    const header = document.querySelector('header.header');
    if (header) {
        header.innerHTML = headerHTML;
        initMenuToggle();
    }
}

/**
 * Renderizza il footer in tutte le pagine
 */
function renderFooter() {
    const footerHTML = `
        <div class="container">
            <div class="footer-container">
                <!-- Sezione Azienda -->
                <div class="footer-section">
                    <h4>Isola Lido</h4>
                    <p class="footer-description">
                        Piscina e relax per tutta la famiglia. Vieni a scoprire i nostri servizi!
                    </p>
                    <div class="footer-contact-info">
                        <p>
                            <strong>📍 Indirizzo:</strong><br>
                            Via Rivolta, 20062<br>
                            Cassano d'Adda (MI) - Italia
                        </p>
                        <p>
                            <strong>📞 Telefono:</strong><br>
                            <a href="tel:333-499-3469">333-499-3469</a>
                        </p>
                        <p>
                            <strong>📧 Email:</strong><br>
                            <a href="mailto:postamaster@isolalido.it">postamaster@isolalido.it</a>
                        </p>
                    </div>
                </div>

                <!-- Sezione Link Utili -->
                <div class="footer-section">
                    <h4>Link Utili</h4>
                    <ul class="footer-links">
                        <li><a href="${getHomePath()}">Home</a></li>
                        <li><a href="${getServicesPath()}">Servizi e Prezzi</a></li>
                        <li><a href="${getBookingsPath()}">Prenotazioni</a></li>
                        <li><a href="${getContactsPath()}">Contatti</a></li>
                    </ul>
                </div>

                <!-- Sezione Legale -->
                <div class="footer-section">
                    <h4>Informazioni Legali</h4>
                    <ul class="footer-links">
                        <li><a href="${getPrivacyPath()}">Privacy Policy</a></li>
                        <li><a href="${getCookiePath()}">Cookie Policy</a></li>
                        <li><a href="${getTermsPath()}">Termini e Condizioni</a></li>
                        <li><button class="link-button" id="openConsent">Gestisci preferenze cookie</button></li>
                    </ul>
                </div>

                <!-- Sezione Orari -->
                <div class="footer-section">
                    <h4>Orari di Apertura</h4>
                    <ul class="footer-hours">
                        <li><strong>Lun-Ven:</strong> 9:30 - 20:00</li>
                        <li><strong>Sab-Dom:</strong> 9:30 - 21:00</li>
                        <li class="footer-note">Aperto tutto l'anno*</li>
                    </ul>
                </div>
            </div>

            <!-- Sezione Sviluppatore -->
            <div class="footer-developer">
                <div class="footer-divider"></div>
                <div class="footer-developer-content">
                    <p>
                        &copy; 2026 <strong>Isola Lido</strong> - Tutti i diritti riservati.
                    </p>
                    <p class="footer-credits">
                        Sito sviluppato da <strong>Dwebcoding</strong> 
                        <span class="footer-separator">|</span>
                        Web Developer Professionista
                        <span class="footer-separator">|</span>
                        <a href="https://www.dwebcoding.it" target="_blank" rel="noopener noreferrer">www.dwebcoding.it</a>
                    </p>
                </div>
            </div>
        </div>
    `;
    
    const footer = document.querySelector('footer.footer');
    if (footer) {
        footer.innerHTML = footerHTML;
    }
}

/**
 * Determina il percorso del logo in base alla pagina corrente
 */
function getLogoPath() {
    const currentPath = window.location.pathname;
    
    // Se siamo in una sottocartella (html/), il percorso è diverso
    if (currentPath.includes('/html/')) {
        return '../images/logo/logo.svg';
    }
    return 'images/logo/logo.svg';
}

/**
 * Determina il percorso della home in base alla pagina corrente
 */
function getHomePath() {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/html/')) {
        return '../index.html';
    }
    return 'index.html';
}

/**
 * Determina il percorso della pagina servizi
 */
function getServicesPath() {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/html/')) {
        return 'servizi.html';
    }
    return 'html/servizi.html';
}

/**
 * Determina il percorso della pagina prenotazioni
 */
function getBookingsPath() {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/html/')) {
        return 'prenotazioni.html';
    }
    return 'html/prenotazioni.html';
}

/**
 * Determina il percorso della pagina contatti
 */
function getContactsPath() {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/html/')) {
        return 'contatti.html';
    }
    return 'html/contatti.html';
}

/**
 * Determina il percorso della pagina privacy
 */
function getPrivacyPath() {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/html/')) {
        return 'privacy.html';
    }
    return 'html/privacy.html';
}

/**
 * Determina il percorso della pagina cookie
 */
function getCookiePath() {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/html/')) {
        return 'cookie.html';
    }
    return 'html/cookie.html';
}

/**
 * Determina il percorso della pagina termini
 */
function getTermsPath() {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/html/')) {
        return 'termini.html';
    }
    return 'html/termini.html';
}

/**
 * Menu Toggle per mobile hamburger
 * Nota: Questa è una copia dalla funzione in main.js per completezza
 */
function initMenuToggle() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (!menuToggle || !navMenu) return;

    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });

    document.addEventListener('click', function(event) {
        const isClickInsideMenu = navMenu.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnToggle && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
}

/**
 * Inizializza header e footer della pagina
 * @param {string} activePage - Pagina attiva da evidenziare nel menu
 */
function initializePageComponents(activePage = 'home') {
    // Renderizza header e footer
    renderHeader(activePage);
    renderFooter();
    
    // Log per debugging
    console.log(`[Isola Lido] Componenti pagina inizializzati - Pagina attiva: ${activePage}`);
}

/**
 * Event listener al caricamento del DOM
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        // I componenti verranno inizializzati dalle singole pagine
        // Non inizializziamo qui per permettere a ogni pagina di specificare la pagina attiva
    });
}
