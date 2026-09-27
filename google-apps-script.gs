/**
 * Google Apps Script da collegare a un Foglio Google.
 * 1) Crea un Foglio Google.
 * 2) Estensioni > Apps Script.
 * 3) Incolla questo codice e salva.
 * 4) Distribuisci > Nuova distribuzione > App web.
 * 5) Esegui come: te stesso. Accesso: chiunque disponga del link (secondo le policy della scuola).
 * 6) Copia l'URL che termina in /exec dentro config.js.
 */
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const d = JSON.parse(e.postData.contents);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Timestamp","Gruppo","Opera","Prima osservazione","Luce","Colore","Pennellata","Istante","Prova scelta","Motivazione","Accordo iniziale","Idee diverse","Decisione","Conclusione"]);
  }
  sheet.appendRow([
    new Date(), d.groupName||"", d.opera||"", d.q1||"", d.luce||"", d.colore||"",
    d.pennellata||"", d.istante||"", d.proof||"", d.why||"", d.agree||"",
    d.different||"", d.decision||"", d.conclusion||""
  ]);
  return ContentService.createTextOutput("ok");
}