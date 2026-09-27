const steps = [...document.querySelectorAll("[data-step]")];
let current = 0;

const STORAGE_KEY = "detectiveMorisot";

const ids = [
  "groupName",
  "q1",
  "luce",
  "colore",
  "pennellata",
  "istante",
  "proof",
  "why",
  "agree",
  "different",
  "decision",
  "conclusion"
];

const $ = id => document.getElementById(id);


// ======================================================
// SALVATAGGIO LOCALE
// ======================================================

function save() {
  const d = {};

  ids.forEach(id => {
    d[id] = $(id)?.value || "";
  });

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(d)
  );
}


// ======================================================
// CARICAMENTO DATI SALVATI
// ======================================================

function load() {
  try {

    const d = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "{}"
    );

    ids.forEach(id => {

      if ($(id) && d[id] != null) {
        $(id).value = d[id];
      }

    });

    selectButtons(
      "proofChoices",
      $("proof")?.value || ""
    );

    selectButtons(
      "agreeChoices",
      $("agree")?.value || ""
    );

    if ($("differentWrap")) {

      $("differentWrap").hidden =
        $("agree")?.value !== "No";

    }

  } catch (e) {

    console.error(
      "Errore nel caricamento dei dati locali:",
      e
    );

  }
}


// ======================================================
// VISUALIZZAZIONE DELLE SCHERMATE
// ======================================================

function show(saveCurrentData = true) {

  steps.forEach((step, index) => {

    step.hidden =
      index !== current;

  });

  if ($("prev")) {
    $("prev").disabled =
      current === 0;
  }

  if ($("next")) {
    $("next").hidden =
      current === steps.length - 1;
  }

  if ($("progressText")) {

    $("progressText").textContent =
      current === 0
        ? "Opera"
        : `${current} di 5`;

  }

  if ($("bar")) {

    $("bar").style.width =
      `${current / 5 * 100}%`;

  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  if (saveCurrentData) {
    save();
  }
}


// ======================================================
// GESTIONE ERRORI
// ======================================================

function clearErrors() {

  document
    .querySelectorAll(".errorbox")
    .forEach(element => element.remove());

  document
    .querySelectorAll(".invalid")
    .forEach(element => {

      element.classList.remove(
        "invalid"
      );

    });
}


function showError(message, elements = []) {

  clearErrors();

  const box =
    document.createElement("div");

  box.className =
    "errorbox";

  box.setAttribute(
    "role",
    "alert"
  );

  box.textContent =
    message;

  steps[current].prepend(
    box
  );

  elements.forEach(element => {

    if (element) {
      element.classList.add(
        "invalid"
      );
    }

  });

  const firstElement =
    elements.find(Boolean);

  if (firstElement?.focus) {
    firstElement.focus();
  }
}


// ======================================================
// CONTROLLO CAMPI
// ======================================================

function nonEmpty(id) {

  return (
    ($(id)?.value || "")
      .trim()
      .length > 0
  );

}


function validateStep() {

  clearErrors();


  if (current === 0) {

    if (!nonEmpty("groupName")) {

      showError(
        "Inserite il nome o il codice del gruppo prima di continuare.",
        [$("groupName")]
      );

      return false;
    }
  }


  if (current === 1) {

    if (!nonEmpty("q1")) {

      showError(
        "Scrivete la vostra prima osservazione prima di continuare.",
        [$("q1")]
      );

      return false;
    }
  }


  if (current === 2) {

    const missing = [
      "luce",
      "colore",
      "pennellata",
      "istante"
    ].filter(
      id => !nonEmpty(id)
    );

    if (missing.length) {

      showError(
        "Completate tutti e quattro gli indizi prima di continuare.",
        missing.map(id => $(id))
      );

      return false;
    }
  }


  if (current === 3) {

    const missing = [];

    if (!nonEmpty("proof")) {
      missing.push(
        $("proofChoices")
      );
    }

    if (!nonEmpty("why")) {
      missing.push(
        $("why")
      );
    }

    if (missing.length) {

      showError(
        "Scegliete l’indizio più convincente e motivate la scelta.",
        missing
      );

      return false;
    }
  }


  if (current === 4) {

    const missing = [];

    if (!nonEmpty("agree")) {

      missing.push(
        $("agreeChoices")
      );

    }

    if (
      $("agree")?.value === "No" &&
      !nonEmpty("different")
    ) {

      missing.push(
        $("different")
      );

    }

    if (!nonEmpty("decision")) {

      missing.push(
        $("decision")
      );

    }

    if (missing.length) {

      showError(
        "Completate il confronto del gruppo prima di continuare.",
        missing
      );

      return false;
    }
  }


  if (current === 5) {

    if (!nonEmpty("conclusion")) {

      showError(
        "Scrivete la conclusione del gruppo prima di terminare.",
        [$("conclusion")]
      );

      return false;
    }
  }

  return true;
}


// ======================================================
// NAVIGAZIONE
// ======================================================

$("next").onclick = () => {

  if (
    validateStep() &&
    current < 5
  ) {

    current++;
    show();

  }
};


$("prev").onclick = () => {

  if (current > 0) {

    current--;
    show();

  }
};


// ======================================================
// PULSANTI DI SCELTA
// ======================================================

function selectButtons(containerId, value) {

  const container =
    $(containerId);

  if (!container) {
    return;
  }

  [
    ...container.querySelectorAll("button")
  ].forEach(button => {

    button.classList.toggle(
      "selected",
      button.dataset.value === value
    );

  });
}


$("proofChoices").onclick = event => {

  const value =
    event.target.dataset.value;

  if (!value) {
    return;
  }

  $("proof").value =
    value;

  selectButtons(
    "proofChoices",
    value
  );

  save();
};


$("agreeChoices").onclick = event => {

  const value =
    event.target.dataset.value;

  if (!value) {
    return;
  }

  $("agree").value =
    value;

  selectButtons(
    "agreeChoices",
    value
  );

  $("differentWrap").hidden =
    value !== "No";

  if (value !== "No") {

    $("different").value =
      "";

  }

  save();
};


// ======================================================
// SALVATAGGIO AUTOMATICO
// ======================================================

document.addEventListener(
  "input",
  save
);


// ======================================================
// VISUALIZZAZIONE OPERA
// ======================================================

const dlg =
  $("artDialog");

const openArtwork = () => {

  if (dlg) {
    dlg.showModal();
  }

};


$("openArt").onclick =
  openArtwork;

$("artBtn").onclick =
  openArtwork;


$("closeArt").onclick = () => {

  if (dlg) {
    dlg.close();
  }

};


// ======================================================
// RESET DOPO INVIO
// ======================================================

function resetActivity() {

  localStorage.removeItem(
    STORAGE_KEY
  );


  ids.forEach(id => {

    const element =
      $(id);

    if (element) {

      element.value =
        "";

    }

  });


  selectButtons(
    "proofChoices",
    ""
  );

  selectButtons(
    "agreeChoices",
    ""
  );


  if ($("differentWrap")) {

    $("differentWrap").hidden =
      true;

  }


  clearErrors();


  current = 0;


  show(false);


  localStorage.removeItem(
    STORAGE_KEY
  );
}


// ======================================================
// INVIO AL DOCENTE
// ======================================================

$("sendBtn").onclick = async () => {

  if (!validateStep()) {
    return;
  }


  save();


  const endpoint =
    window.APP_CONFIG?.endpoint || "";


  if (!endpoint) {

    $("status").textContent =
      "Collegamento al foglio del docente non disponibile.";

    return;
  }


  const d = JSON.parse(
    localStorage.getItem(STORAGE_KEY) || "{}"
  );


  d.opera =
    "Berthe Morisot – La culla, 1872";


  d.timestamp =
    new Date().toISOString();


  $("status").textContent =
    "Invio in corso…";


  $("sendBtn").disabled =
    true;


  try {

    await fetch(
      endpoint,
      {
        method: "POST",

        mode: "no-cors",

        headers: {
          "Content-Type": "text/plain"
        },

        body:
          JSON.stringify(d)
      }
    );


    resetActivity();


    $("status").textContent =
      "Risposte inviate al docente. Il tablet è pronto per un nuovo gruppo.";


  } catch (error) {

    console.error(
      "Errore durante l'invio:",
      error
    );


    $("status").textContent =
      "Invio non riuscito. Le risposte restano salvate su questo tablet.";

  } finally {

    $("sendBtn").disabled =
      false;
  }
};


// ======================================================
// AVVIO
// ======================================================

load();
show();
