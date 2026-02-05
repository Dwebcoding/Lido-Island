// ============ CACHE DISPONIBILITÀ ============
// Logica disponibilità rimossa: ora solo banner locale
// Logica disponibilità rimossa
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


// ============ VARIABILI GLOBALI ============

let currentBooking = {
    date: '',
    tables: 0,
    chairs: 0
};

// ============ INIZIALIZZAZIONE ============
/**
 * Imposta la data minima del campo data a domani
 */
function setMinDate() {
    const dateInput = document.getElementById('bookingDate');
    if (!dateInput) return;
    const today = new Date();
    today.setDate(today.getDate() + 1); // domani
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
}

/**
 * Inizializza il sistema di prenotazione
 */
function initBookingSystem() {
        // Impedisci modifica manuale degli input quantità
        document.getElementById('tableQty')?.addEventListener('keydown', e => e.preventDefault());
        document.getElementById('chairQty')?.addEventListener('keydown', e => e.preventDefault());
    console.log('[Booking System] Inizio inizializzazione...');
    
    // EmailJS rimosso: la logica email è ora gestita solo dal backend
    
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
        // EmailJS rimossa: la funzione non invia più email direttamente
        // La logica di invio email è ora gestita solo dal backend
    });
}

// ============ GESTIONE QUANTITÀ SDRAIO ============

/**
 * Aumenta la quantità di sdraio
 */
/**
 * Aumenta la quantità di tavoli
 */
function incrementTable() {
    console.log('[Booking] incrementTable - Prima:', {
        currentTables: currentBooking.tables,
        availableTables: getAvailableTables()
    });
    const availableTables = getAvailableTables();
        currentBooking.tables++;
        updateDisplay();
}

/**
 * Diminuisce la quantità di tavoli
 */
function decrementTable() {
    console.log('[Booking] decrementTable - Prima:', currentBooking.tables);
    if (currentBooking.tables > 0) {
        currentBooking.tables--;
        updateDisplay();
        console.log('[Booking] decrementTable - Dopo:', currentBooking.tables);
    }
}
function incrementChair() {
    console.log('[Booking] incrementChair - Prima:', {
        currentChairs: currentBooking.chairs,
        availableChairs: getAvailableChairs()
    });
    
    const availableChairs = getAvailableChairs();
        currentBooking.chairs++;
        updateDisplay();
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
    // Aggiorna quantità visualizzata
    document.getElementById('tableQty').textContent = currentBooking.tables;
    document.getElementById('chairQty').textContent = currentBooking.chairs;
    
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
    // Mostra solo massimali statici e banner locale
    document.getElementById('tableAvailability').textContent = `Disponibili: 110 tavoli`;
    document.getElementById('chairAvailability').textContent = `Disponibili: 65 sdraio`;
    // Banner avviso
    const banner = document.getElementById('bookingWarningBanner');
    if (banner) {
        banner.style.display = 'none';
        if (110 - currentBooking.tables <= 10) {
            banner.textContent = 'Attenzione: rimangono meno di 10 tavoli disponibili!';
            banner.style.display = 'block';
        } else if (65 - currentBooking.chairs <= 10) {
            banner.textContent = 'Attenzione: rimangono meno di 10 sdraio disponibili!';
            banner.style.display = 'block';
        }
    }
    // Pulsanti sempre abilitati (nessuna logica di blocco)
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

        // Controllo disponibilità aggiornata dalla cache locale
        fetchAvailability(currentBooking.date)
            .then(data => {
                const availableTables = data.tables.available;
                const availableChairs = data.chairs.available;
                if (currentBooking.tables > availableTables || currentBooking.chairs > availableChairs) {
                    showError('Disponibilità esaurita', 'La quantità richiesta supera la disponibilità attuale. Aggiorna la pagina e riprova.');
                    alert('❌ Errore: disponibilità esaurita o cambiata.');
                    return;
                }
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
            })
            .catch(error => {
                console.error('[Booking] ❌ ERRORE DISPONIBILITÀ:', error);
                alert('❌ Errore di disponibilità. Riprova più tardi.');
            });
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
 * Invia email di prenotazione al proprietario (API REST diretta)
 * @param {Object} booking - Dati della prenotazione
 */
function sendBookingEmail(booking) {
    console.log('[Email] Invio email per prenotazione:', booking.id);
    
    try {
        // Calcola i totali
        const tablesTotal = booking.tables * BOOKING_CONFIG.TABLES.price;
        const chairsTotal = booking.chairs * BOOKING_CONFIG.CHAIRS.price;
        const total = tablesTotal + chairsTotal;
        
        // Prepara i parametri per EmailJS API
        const emailData = {
            service_id: EMAILJS_CONFIG.SERVICE_ID,
            template_id: EMAILJS_CONFIG.TEMPLATE_ID,
            user_id: EMAILJS_CONFIG.PUBLIC_KEY,
            template_params: {
                // Parametri standard EmailJS
                from_name: booking.name,
                to_name: 'Isola Lido',
                reply_to: booking.email,
                // Parametri personalizzati prenotazione
                customer_name: booking.name,
                customer_email: booking.email,
                customer_phone: booking.phone,
                booking_id: booking.id,
                booking_date: formatDate(booking.date),
                tables_count: booking.tables.toString(),
                tables_price: tablesTotal.toFixed(2),
                chairs_count: booking.chairs.toString(),
                chairs_price: chairsTotal.toFixed(2),
                total_price: total.toFixed(2),
                booking_notes: booking.notes || 'Nessuna nota',
                booking_timestamp: new Date(booking.timestamp).toLocaleString('it-IT')
            }
        };
        
        console.log('[Email] Invio email...');
        
        // Chiama l'API REST di EmailJS
        fetch('https://lido-island-production.up.railway.app/api/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailData)
        })
        .then(response => {
            if (response.ok) {
                console.log('[Email] ✅ Email inviata con successo!');
                return response.text();
            } else {
                return response.text().then(text => {
                    throw new Error(`Errore ${response.status}: ${text}`);
                });
            }
        })
        .then(data => {
            console.log('[Email] Response:', data);
        })
        .catch(error => {
            console.error('[Email] ❌ Errore nell\'invio:', error);
        });
        
    } catch (error) {
        console.error('[Email] ❌ Errore critico:', error);
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
