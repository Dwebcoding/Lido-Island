# Isola Lido Backend

Backend Node.js/Express per la gestione delle prenotazioni di Isola Lido.

## Funzionalità
- API RESTful per creare e consultare prenotazioni
- Database SQLite locale
- Invio email di notifica al proprietario (template HTML personalizzabile)
- Pronto per estensione multi-cliente

## Avvio locale
1. Installa le dipendenze:
   ```
   npm install
   ```
2. Avvia il server in sviluppo:
   ```
   npm run dev
   ```
   Oppure in produzione:
   ```
   npm start
   ```

## Configurazione SMTP
Modifica la funzione `sendBookingEmail` in `server.js` con i dati SMTP reali e il template HTML desiderato.

## API
- `POST /api/prenotazioni` — Crea una nuova prenotazione
- `GET /api/prenotazioni` — Elenco prenotazioni (admin)

## Sicurezza
- Proteggi l'endpoint GET in produzione (autenticazione necessaria)
- Valida sempre i dati in ingresso

---

© 2026 Isola Lido
