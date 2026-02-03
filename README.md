# 🏊 ISOLA LIDO - Sito Web Statico

Sito web moderno e responsive per una piscina balneare con area relax e servizi completi.

## 📁 Struttura del Progetto

```
Lido Island/
├── index.html                 # Pagina Home
├── css/
│   └── style.css             # Stylesheet principale (responsive)
├── js/
│   └── main.js               # JavaScript vanilla (menu, form, animazioni)
├── html/
│   ├── servizi.html          # Pagina servizi e listino prezzi
│   └── contatti.html         # Pagina contatti e form
├── images/
│   ├── logo/
│   │   └── logo.svg          # Logo Isola Lido
│   └── banner index/
│       ├── pool 1.png        # Foto piscina
│       ├── pool 2.png        # Foto piscina
│       ├── pool 3.png        # Foto piscina
│       ├── lido 1.png        # Foto area
│       ├── lido 2.png        # Foto area
│       ├── pic nic 1.png     # Foto picnic
│       └── pic nic 2.png     # Foto picnic
└── README.md                 # Questo file
```

## 🎨 Tecnologie Utilizzate

- **HTML5**: Markup semantico
- **CSS3**: Responsive design, flexbox, grid, animazioni
- **JavaScript Vanilla**: Senza framework, codice puro
- **Google Fonts**: Font Playfair Display e Poppins
- **Responsive**: Desktop, Tablet, Mobile

## 🎯 Pagine Disponibili

### 1. **Home** (`index.html`)
- Hero section con background parallax
- Galleria 6 foto (2x3 grid responsive)
- Descrizione del lido
- Anteprima servizi offerti
- Call to action verso servizi e contatti

### 2. **Servizi** (`html/servizi.html`)
- Sezione servizi dettagliata con 6 servizi
- **Listino Prezzi 2026**:
  - Dal lunedì al venerdì (ore 9:30, 17:00, pausa pranzo 12:00-14:00)
  - Sabato (ore 9:30, 17:00)
  - Domenica e Festivi (ore 9:30, 17:00)
  - **Offerte Speciali**: Abbonamenti e carnet
- Tabelle responsive con prezzi chiari
- Note importanti su bambini sotto 1 metro (ingresso gratuito)

### 3. **Contatti** (`html/contatti.html`)
- Informazioni di contatto (indirizzo, telefono, email, orari)
- **Form di contatto** con validazione JavaScript:
  - Nome (obbligatorio, min 2 caratteri)
  - Email (obbligatorio, validazione email)
  - Telefono (opzionale)
  - Soggetto
  - Messaggio (obbligatorio, min 5 caratteri)
  - Messaggi di errore/successo
- Mappa embedded Google Maps
- Sezione FAQ con 6 domande frequenti

## 🎨 Colori Utilizzati

```css
--color-primary: #00a8e8      /* Azzurro */
--color-secondary: #00d9ff    /* Turchese */
--color-accent: #ffc400       /* Sabbia/Oro */
--color-light: #f0f9ff        /* Bianco-azzurro */
--color-white: #ffffff        /* Bianco */
--color-dark: #1a3a4a         /* Blu scuro */
--color-text: #2c3e50         /* Testo */
--color-border: #e0e8f0       /* Bordi */
```

## ⚙️ Funzionalità JavaScript

### Menu Mobile Hamburger
- Toggle automatico su schermi <= 768px
- Chiude quando si clicca su un link
- Chiude quando si clicca fuori dal menu

### Validazione Form Contatti
- Validazione real-time dei campi
- Messaggi di errore personalizzati
- Messaggio di successo con reset del form
- Rimozione degli errori quando l'utente inizia a digitare

### Animazioni e Effetti
- Fade-in-up per elementi in scroll
- Hover effects su card e bottoni
- Smooth scroll per link anchor
- Parallax effect su hero section

### Link Attivi
- Aggiornamento automatico del link attivo in base alla pagina

## 📱 Responsive Design

- **Desktop** (> 768px): Layout completo con navigazione orizzontale
- **Tablet** (768px): Menu hamburger, layout adattato
- **Mobile** (< 480px): Font ridotti, single column, pulsanti full-width

## 🚀 Come Usare

1. **Apri il file** `index.html` nel browser
2. **Naviga** tra le pagine usando il menu
3. **Compila il form** di contatto (non invia email reali, solo validazione)
4. **Prova il menu mobile** su schermi piccoli

## 📝 Note Importanti

- **Form**: La validazione è client-side. Per inviare email reali, configura un backend.
- **Mappa**: L'iframe è un placeholder. Aggiorna con coordinate reali se necessario.
- **Immagini**: Utilizza le immagini dalla cartella `images/`. Sono già presenti nel progetto.
- **Accessibilità**: Codice conforme a standard WCAG con support per `prefers-reduced-motion`

## 🔧 Personalizzazioni Consigliate

Per personalizzare il sito:

1. **Logo**: Sostituisci `images/logo/logo.svg` con il tuo logo
2. **Colori**: Modifica le variabili CSS in `:root` di `style.css`
3. **Contenuti**: Aggiorna i testi nelle pagine HTML
4. **Immagini**: Sostituisci le foto della galleria
5. **Telefono/Email**: Aggiorna i dati di contatto in `html/contatti.html`
6. **Mappa**: Cambia le coordinate della mappa embedded

## 💡 Miglioramenti Futuri

- Integrazione con servizio email (Formspree, EmailJS, etc.)
- Galleria lightbox interattiva
- Prenotazioni online con calendario
- Integrazione social media
- Blog/News section
- Sistema di notifiche

## 📄 Licenza

Questo sito è stato creato come progetto web statico. Sentirti libero di modificarlo secondo le tue esigenze.

---

**Creato da**: Web Developer Professionista  
**Data**: 2026  
**Versione**: 1.0
