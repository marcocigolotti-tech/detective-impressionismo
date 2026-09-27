# Detective dell'Impressionismo

Attività cooperativa tablet-first ideata dal Prof. Marco Cigolotti.

## Struttura
- Home con 4 gruppi: Monet, Renoir, Degas, Morisot.
- Ogni gruppo ha la propria scheda guidata.
- Le risposte sono obbligatorie e salvate localmente sul dispositivo.
- Tutte le schede sono predisposte per inviare i dati allo stesso Google Sheet.

## Pubblicazione su GitHub Pages
Caricare TUTTO il contenuto di questa cartella nella root di un unico repository.
Poi: Settings > Pages > Deploy from a branch > main / root.

## Google Sheets
1. Crea un Foglio Google.
2. Estensioni > Apps Script.
3. Incolla `google-apps-script.gs`.
4. Distribuisci come Web App secondo le autorizzazioni consentite dall'istituto.
5. Copia l'URL `/exec`.
6. Inseriscilo in `config.js` nel campo `endpoint`.
7. Carica/aggiorna `config.js` su GitHub.

Le righe inviate contengono automaticamente anche il nome dell'opera, così le risposte dei quattro gruppi possono confluire nello stesso foglio.
