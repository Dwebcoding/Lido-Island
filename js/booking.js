/* ============================================
   ISOLA LIDO - BOOKING SYSTEM
   Sistema di Prenotazione Tavoli e Sdraio
   Author: Web Developer Professionista
   ============================================ */

// ============ CONFIGURAZIONE ============

const BOOKING_CONFIG = {
    TABLES: {
        total: 110,
        price: 8.00,
        capacity: 8
    },
    CHAIRS: {
        total: 65,
        price: 5.00
    },
    STORAGE_KEY: 'isolaLido_bookings'
};

// ============ CONFIGURAZIONE EMAILJS ============

const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_ln6w547',
    TEMPLATE_ID: 'template_gqbalv6',
    PUBLIC_KEY: 'WmW6GZu0mgbFXIXgw',
    OWNER_EMAIL: 'd.webcoding@gmail.com'
};

// Tracker per timeout EmailJS
let emailjsInitAttempts = 0;
const MAX_EMAILJS_ATTEMPTS = 5; // Solo 5 tentativi (500ms totali)

/**
 * Inizializza EmailJS
 */
function initEmailJS() {
    // Attendere che emailjs sia caricato
    if (typeof emailjs === 'undefined') {
        emailjsInitAttempts++;
        
        if (emailjsInitAttempts >= MAX_EMAILJS_ATTEMPTS) {
            console.warn('[EmailJS] ⚠️ CDN non disponibile. Prenotazioni funzioneranno senza email.');
            return;
        }
        
        setTimeout(() => initEmailJS(), 100);
        return;
    }
    
    try {
        emailjs.init({
            publicKey: EMAILJS_CONFIG.PUBLIC_KEY,
            limitRate: {
                id: 'app',
                throttle: 50,
            },
        });
        console.log('[EmailJS] ✅ Inizializzato correttamente');
    } catch (error) {
        console.error('[EmailJS] ❌ Errore durante inizializzazione:', error);
    }
}

// ============ VARIABILI GLOBALI ============

let currentBooking = {
    date: '',
    tables: 0,
    chairs: 0
};

// ============ INIZIALIZZAZIONE ============

/**
 * Inizializza il sistema di prenotazione
 */
function initBookingSystem() {
    console.log('[Booking System] Inizio inizializzazione...');
    
    // Inizializza EmailJS
    initEmailJS();
    
    // Imposta la data minima (domani)
    setMinDate();
    
    // Verifica che i pulsanti esistano
    const tablePlus = document.getElementById('tablePlus');
    const tableMinus = document.getElementById('tableMinus');
    const chairPlus = document.getElementById('chairPlus');
    const chairMinus = document.getElementById('chairMinus');
    
    console.log('[Booking System] Pulsanti trovati:', {
        tablePlus: !!tablePlus,
        tableMinus: !!tableMinus,
        chairPlus: !!chairPlus,
        chairMinus: !!chairMinus
    });
    
    // Event listeners per quantità
    tablePlus?.addEventListener('click', () => {
        console.log('[Booking] Click tablePlus');
        incrementTable();
    });
    tableMinus?.addEventListener('click', () => {
        console.log('[Booking] Click tableMinus');
        decrementTable();
    });
    chairPlus?.addEventListener('click', () => {
        console.log('[Booking] Click chairPlus');
        incrementChair();
    });
    chairMinus?.addEventListener('click', () => {
        console.log('[Booking] Click chairMinus');
        decrementChair();
    });
    
    // Event listener per data
    document.getElementById('bookingDate')?.addEventListener('change', (e) => {
        currentBooking.date = e.target.value;
        updateAvailability();
    });
    
    // Event listener per form
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        console.log('[Booking System] Form trovato, attaching submit listener...');
        bookingForm.addEventListener('submit', (e) => {
            console.log('[Booking] SUBMIT EVENT TRIGGERED');
            handleBookingSubmit(e);
        });
    } else {
        console.error('[Booking System] ❌ Form NON trovato! ID: bookingForm');
    }
    
    // Aggiorna disponibilità inizialmente
    updateAvailability();
    console.log('[Booking System] Inizializzazione completata');
}

// ============ GESTIONE DATE ============

/**
 * Imposta la data minima (domani)
 */
function setMinDate() {
    const dateInput = document.getElementById('bookingDate');
    if (!dateInput) return;
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const formattedDate = tomorrow.toISOString().split('T')[0];
    dateInput.min = formattedDate;
    dateInput.value = formattedDate;
    currentBooking.date = formattedDate;
}

// ============ GESTIONE QUANTITÀ TAVOLI ============

/**
 * Aumenta la quantità di tavoli
 */
function incrementTable() {
    const availableTables = getAvailableTables();
    if (currentBooking.tables < availableTables) {
        currentBooking.tables++;
        updateDisplay();
    }
}

/**
 * Diminuisce la quantità di tavoli
 */
function decrementTable() {
    if (currentBooking.tables > 0) {
        currentBooking.tables--;
        updateDisplay();
    }
}

// ============ GESTIONE QUANTITÀ SDRAIO ============

/**
 * Aumenta la quantità di sdraio
 */
function incrementChair() {
    console.log('[Booking] incrementChair - Prima:', {
        currentChairs: currentBooking.chairs,
        availableChairs: getAvailableChairs()
    });
    
    const availableChairs = getAvailableChairs();
    if (currentBooking.chairs < availableChairs) {
        currentBooking.chairs++;
        updateDisplay();
        console.log('[Booking] incrementChair - Dopo:', currentBooking.chairs);
    } else {
        console.log('[Booking] incrementChair - BLOCCATO: non ci sono altre sdraio disponibili');
    }
}

/**
 * Diminuisce la quantità di sdraio
 */
function decrementChair() {
    console.log('[Booking] decrementChair - Prima:', currentBooking.chairs);
    if (currentBooking.chairs > 0) {
        currentBooking.chairs--;
        updateDisplay();
        console.log('[Booking] decrementChair - Dopo:', currentBooking.chairs);
    }
}

// ============ CALCOLO DISPONIBILITÀ ============

/**
 * Ottiene i tavoli disponibili per la data selezionata
 * @returns {number} Numero di tavoli disponibili
 */
function getAvailableTables() {
    const booked = getBookedTablesByDate(currentBooking.date);
    return Math.max(0, BOOKING_CONFIG.TABLES.total - booked);
}

/**
 * Ottiene le sdraio disponibili per la data selezionata
 * @returns {number} Numero di sdraio disponibili
 */
function getAvailableChairs() {
    const booked = getBookedChairsByDate(currentBooking.date);
    return Math.max(0, BOOKING_CONFIG.CHAIRS.total - booked);
}

/**
 * Ottiene i tavoli prenotati per una data specifica
 * @param {string} date - Data in formato YYYY-MM-DD
 * @returns {number} Numero di tavoli prenotati
 */
function getBookedTablesByDate(date) {
    const bookings = getStoredBookings();
    return bookings
        .filter(b => b.date === date)
        .reduce((total, b) => total + b.tables, 0);
}

/**
 * Ottiene le sdraio prenotate per una data specifica
 * @param {string} date - Data in formato YYYY-MM-DD
 * @returns {number} Numero di sdraio prenotate
 */
function getBookedChairsByDate(date) {
    const bookings = getStoredBookings();
    return bookings
        .filter(b => b.date === date)
        .reduce((total, b) => total + b.chairs, 0);
}

// ============ AGGIORNAMENTO DISPLAY ============

/**
 * Aggiorna l'interfaccia con i valori correnti
 */
function updateDisplay() {
    // Aggiorna input quantity
    document.getElementById('tableQty').value = currentBooking.tables;
    document.getElementById('chairQty').value = currentBooking.chairs;
    
    // Aggiorna subtotali
    const tableSubtotal = currentBooking.tables * BOOKING_CONFIG.TABLES.price;
    const chairSubtotal = currentBooking.chairs * BOOKING_CONFIG.CHAIRS.price;
    const total = tableSubtotal + chairSubtotal;
    
    document.getElementById('tableSubtotal').textContent = 
        `Subtotale: € ${tableSubtotal.toFixed(2)}`;
    document.getElementById('chairSubtotal').textContent = 
        `Subtotale: € ${chairSubtotal.toFixed(2)}`;
    
    // Aggiorna riepilogo
    document.getElementById('summaryTableQty').textContent = currentBooking.tables;
    document.getElementById('summaryChairQty').textContent = currentBooking.chairs;
    document.getElementById('summaryTablePrice').textContent = 
        `€ ${tableSubtotal.toFixed(2)}`;
    document.getElementById('summaryChairPrice').textContent = 
        `€ ${chairSubtotal.toFixed(2)}`;
    document.getElementById('summaryTotal').textContent = 
        `€ ${total.toFixed(2)}`;
}

/**
 * Aggiorna la visualizzazione della disponibilità
 */
function updateAvailability() {
    const availableTables = getAvailableTables();
    const availableChairs = getAvailableChairs();
    
    // Aggiorna testo disponibilità
    document.getElementById('tableAvailability').textContent = 
        `Disponibili: ${availableTables} tavoli`;
    document.getElementById('chairAvailability').textContent = 
        `Disponibili: ${availableChairs} sdraio`;
    
    // Gestisci i pulsanti + usando una classe invece di disabled
    const tablePlusBtn = document.getElementById('tablePlus');
    const chairPlusBtn = document.getElementById('chairPlus');
    
    if (availableTables === 0) {
        tablePlusBtn.classList.add('disabled-btn');
        tablePlusBtn.setAttribute('disabled', 'disabled');
    } else {
        tablePlusBtn.classList.remove('disabled-btn');
        tablePlusBtn.removeAttribute('disabled');
    }
    
    if (availableChairs === 0) {
        chairPlusBtn.classList.add('disabled-btn');
        chairPlusBtn.setAttribute('disabled', 'disabled');
    } else {
        chairPlusBtn.classList.remove('disabled-btn');
        chairPlusBtn.removeAttribute('disabled');
    }
    
    // Reset quantità se non disponibili
    if (currentBooking.tables > availableTables) {
        currentBooking.tables = availableTables;
    }
    if (currentBooking.chairs > availableChairs) {
        currentBooking.chairs = availableChairs;
    }
    
    updateDisplay();
}

// ============ VALIDAZIONE FORM ============

/**
 * Valida i dati del form di prenotazione
 * @returns {boolean} True se valido
 */
function validateBookingForm() {
    console.log('[Booking] Inizio validazione form');
    
    // Resetta gli errori
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
    });
    
    // Nascondi messaggio errore precedente
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.classList.add('hidden');
    }
    
    let isValid = true;
    
    // Valida data
    if (!currentBooking.date) {
        showError('Data non selezionata', 'Seleziona una data valida');
        isValid = false;
    }
    
    // Valida che sia selezionato almeno qualcosa
    if (currentBooking.tables === 0 && currentBooking.chairs === 0) {
        showError('Nessun articolo selezionato', 'Seleziona almeno un tavolo o una sdraio');
        isValid = false;
    }
    
    // Valida Nome
    const nameInput = document.querySelector('input[name="name"]');
    if (!nameInput || nameInput.value.trim().length < 2) {
        if (nameInput) markFieldAsError(nameInput, 'Il nome deve contenere almeno 2 caratteri');
        isValid = false;
    }
    
    // Valida Email
    const emailInput = document.querySelector('input[name="email"]');
    if (!emailInput || !validateEmail(emailInput.value.trim())) {
        if (emailInput) markFieldAsError(emailInput, 'Inserisci un email valido');
        isValid = false;
    }
    
    // Valida Telefono
    const phoneInput = document.querySelector('input[name="phone"]');
    if (!phoneInput || phoneInput.value.trim().length < 10) {
        if (phoneInput) markFieldAsError(phoneInput, 'Inserisci un numero di telefono valido');
        isValid = false;
    }
    
    console.log('[Booking] Validazione risultato:', isValid);
    
    return isValid;
}

/**
 * Marca un campo come errore
 * @param {HTMLElement} field - Il campo
 * @param {string} message - Messaggio di errore
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
 * Valida un indirizzo email
 * @param {string} email - L'email
 * @returns {boolean} True se valida
 */
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ============ GESTIONE SUBMIT ============

/**
 * Gestisce l'invio del form di prenotazione
 * @param {Event} e - L'evento submit
 */
function handleBookingSubmit(e) {
    console.log('[Booking] Submit form iniziato');
    e.preventDefault();
    
    alert('✓ Prenotazione ricevuta!'); // DEBUG: Verifica che il click funziona
    
    try {
        // Valida il form
        if (!validateBookingForm()) {
            console.log('[Booking] ❌ Validazione fallita');
            alert('❌ Errore: Compila correttamente tutti i campi!');
            return;
        }
        
        console.log('[Booking] ✅ Validazione passata, creazione booking...');
        
        // Crea la prenotazione
        const booking = {
            id: generateBookingId(),
            date: currentBooking.date,
            tables: currentBooking.tables,
            chairs: currentBooking.chairs,
            name: document.querySelector('input[name="name"]').value,
            email: document.querySelector('input[name="email"]').value,
            phone: document.querySelector('input[name="phone"]').value,
            notes: document.querySelector('textarea[name="notes"]').value,
            timestamp: new Date().toISOString()
        };
        
        console.log('[Booking] Booking creato:', booking);
        
        // Salva la prenotazione
        saveBooking(booking);
        
        console.log('[Booking] ✅ Booking salvato');
        alert(`✅ Prenotazione confermata!\nID: ${booking.id}`); // DEBUG: Mostra successo
        
        // Mostra successo
        showBookingSuccess(booking);
        
        // Resetta il form
        resetBookingForm();
    } catch (error) {
        console.error('[Booking] ❌ ERRORE CRITICO:', error);
        alert(`❌ ERRORE: ${error.message}`); // DEBUG: Mostra errore
        showError('Errore nella Prenotazione', 'Si è verificato un errore imprevisto. Controlla la console per i dettagli.');
    }
}

/**
 * Genera un ID unico per la prenotazione
 * @returns {string} ID prenotazione
 */
function generateBookingId() {
    return `ISOLA-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

/**
 * Mostra il messaggio di successo
 * @param {Object} booking - Dati della prenotazione
 */
function showBookingSuccess(booking) {
    console.log('[Booking] Mostrando messaggio di successo');
    
    // Nascondi messaggio errore se visibile
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.classList.add('hidden');
    }
    
    const successDiv = document.getElementById('successMessage');
    if (successDiv) {
        document.getElementById('bookingId').textContent = booking.id;
        successDiv.classList.remove('hidden');
        
        // Scroll to success message
        setTimeout(() => {
            successDiv.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        
        console.log('[Booking] Messaggio di successo mostrato');
    } else {
        console.error('[Booking] Elemento successMessage non trovato');
    }
}

/**
 * Mostra un messaggio di errore
 * @param {string} title - Titolo
 * @param {string} message - Messaggio
 */
function showError(title, message) {
    console.log('[Booking] Mostrando errore:', title, message);
    
    // Nascondi messaggio successo se visibile
    const successDiv = document.getElementById('successMessage');
    if (successDiv) {
        successDiv.classList.add('hidden');
    }
    
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        const errorTitle = errorDiv.querySelector('h3');
        const errorText = document.getElementById('errorText');
        
        if (errorTitle) errorTitle.textContent = title;
        if (errorText) errorText.textContent = message;
        
        errorDiv.classList.remove('hidden');
        
        setTimeout(() => {
            errorDiv.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        
        console.log('[Booking] Messaggio di errore mostrato');
    } else {
        console.error('[Booking] Elemento errorMessage non trovato');
        alert(`${title}\n\n${message}`);
    }
}

/**
 * Resetta il form di prenotazione
 */
function resetBookingForm() {
    console.log('[Booking] Reset form');
    
    currentBooking = {
        date: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        tables: 0,
        chairs: 0
    };
    
    // Resetta il form HTML
    const form = document.getElementById('bookingForm');
    if (form) {
        form.reset();
    }
    
    // Resetta gli errori
    document.querySelectorAll('.form-group.error').forEach(group => {
        group.classList.remove('error');
    });
    
    setMinDate();
    updateAvailability();
}

// ============ GESTIONE STORAGE ============

/**
 * Ottiene le prenotazioni memorizzate
 * @returns {Array} Array di prenotazioni
 */
function getStoredBookings() {
    const stored = localStorage.getItem(BOOKING_CONFIG.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

/**
 * Salva una prenotazione
 * @param {Object} booking - Dati della prenotazione
 */
function saveBooking(booking) {
    const bookings = getStoredBookings();
    bookings.push(booking);
    localStorage.setItem(BOOKING_CONFIG.STORAGE_KEY, JSON.stringify(bookings));
    
    // Invia email al proprietario
    sendBookingEmail(booking);
    
    logBooking('Prenotazione salvata', {
        id: booking.id,
        date: booking.date,
        tables: booking.tables,
        chairs: booking.chairs
    });
}

/**
 * Invia email di prenotazione al proprietario
 * @param {Object} booking - Dati della prenotazione
 */
function sendBookingEmail(booking) {
    console.log('[EmailJS] Inizio invio email per prenotazione:', booking.id);
    
    // Se EmailJS non è caricato, aspetta e riprova
    if (typeof emailjs === 'undefined') {
        console.warn('[EmailJS] ⚠️ EmailJS non ancora caricato, riprovo tra 500ms...');
        setTimeout(() => sendBookingEmail(booking), 500);
        return;
    }
    
    try {
        // Calcola il totale
        const tablesTotal = booking.tables * BOOKING_CONFIG.TABLES.price;
        const chairsTotal = booking.chairs * BOOKING_CONFIG.CHAIRS.price;
        const total = tablesTotal + chairsTotal;
        
        // Prepara i dati per EmailJS
        const templateParams = {
            to_email: EMAILJS_CONFIG.OWNER_EMAIL,
            customer_name: booking.name,
            customer_email: booking.email,
            customer_phone: booking.phone || 'Non fornito',
            booking_date: formatDate(booking.date),
            tables_count: booking.tables,
            chairs_count: booking.chairs,
            tables_price: tablesTotal.toFixed(2),
            chairs_price: chairsTotal.toFixed(2),
            total_price: total.toFixed(2),
            booking_notes: booking.notes || 'Nessuna nota',
            booking_id: booking.id,
            booking_timestamp: new Date(booking.timestamp).toLocaleString('it-IT')
        };
        
        console.log('[EmailJS] Invio email con parametri:', templateParams);
        
        // Invia l'email
        emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            templateParams
        ).then((response) => {
            console.log('[EmailJS] ✅ Email inviata con successo', response);
            logBooking('Email inviata con successo a ' + EMAILJS_CONFIG.OWNER_EMAIL, {
                status: response.status,
                booking_id: booking.id
            });
        }).catch((error) => {
            console.error('[EmailJS] ❌ Errore nell\'invio email:', error);
            logBooking('Errore nell\'invio email: ' + error.message, {
                booking_id: booking.id
            });
            
            // Se EmailJS fallisce, log comunque salvato su localStorage
            alert('⚠️ Email non inviata, ma prenotazione salvata.\n\nContatta il proprietario per confermare.');
        });
    } catch (error) {
        console.error('[EmailJS] ❌ ERRORE CRITICO:', error);
        logBooking('Errore critico nell\'invio email', error);
    }
}

/**
 * Ottiene le prenotazioni di un utente per email
 * @param {string} email - Email dell'utente
 * @returns {Array} Array di prenotazioni
 */
function getUserBookings(email) {
    return getStoredBookings().filter(b => b.email === email);
}

// ============ UTILITY ============

/**
 * Formatta una data
 * @param {string} dateStr - Data in formato YYYY-MM-DD
 * @returns {string} Data formattata
 */
function formatDate(dateStr) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('it-IT', options);
}

/**
 * Logger per debugging
 * @param {string} message - Messaggio
 * @param {*} data - Dati opzionali
 */
function logBooking(message, data = null) {
    if (data) {
        console.log(`[Isola Lido Booking] ${message}`, data);
    } else {
        console.log(`[Isola Lido Booking] ${message}`);
    }
}

// ============ INIZIALIZZAZIONE GLOBALE ============

/**
 * Inizializza quando il DOM è caricato
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBookingSystem);
} else {
    initBookingSystem();
}

// Log inizializzazione
logBooking('Sistema di prenotazione inizializzato');
logBooking('Tavoli disponibili: ' + BOOKING_CONFIG.TABLES.total);
logBooking('Sdraio disponibili: ' + BOOKING_CONFIG.CHAIRS.total);
