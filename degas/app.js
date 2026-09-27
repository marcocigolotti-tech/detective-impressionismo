const steps=[...document.querySelectorAll("[data-step]")]; let current=0;
const ids=["groupName","q1","luce","colore","pennellata","istante","proof","why","agree","different","decision","conclusion"];
const $=id=>document.getElementById(id);
function save(){const d={};ids.forEach(id=>d[id]=$(id)?.value||"");localStorage.setItem("detectiveDegas",JSON.stringify(d))}
function load(){try{const d=JSON.parse(localStorage.getItem("detectiveDegas")||"{}");ids.forEach(id=>{if($(id)&&d[id]!=null)$(id).value=d[id]});selectButtons("proofChoices",$("proof").value);selectButtons("agreeChoices",$("agree").value);$("differentWrap").hidden=$("agree").value!=="No"}catch(e){}}
function show(){steps.forEach((s,i)=>s.hidden=i!==current);$("prev").disabled=current===0;$("next").hidden=current===steps.length-1;$("progressText").textContent=current===0?"Opera":`${current} di 5`;$("bar").style.width=`${current/5*100}%`;scrollTo({top:0,behavior:"smooth"});save()}
function clearErrors(){
  document.querySelectorAll(".errorbox").forEach(e=>e.remove());
  document.querySelectorAll(".invalid").forEach(e=>e.classList.remove("invalid"));
}
function showError(message, elements=[]){
  clearErrors();
  const box=document.createElement("div");
  box.className="errorbox";
  box.setAttribute("role","alert");
  box.textContent=message;
  steps[current].prepend(box);
  elements.forEach(el=>el&&el.classList.add("invalid"));
  (elements[0]||box).focus?.();
}
function nonEmpty(id){return ($(id)?.value||"").trim().length>0}
function validateStep(){
  clearErrors();
  if(current===0){
    if(!nonEmpty("groupName")){showError("Inserite il nome o il codice del gruppo prima di continuare.",[$("groupName")]);return false}
  }
  if(current===1){
    if(!nonEmpty("q1")){showError("Scrivete la vostra prima osservazione prima di continuare.",[$("q1")]);return false}
  }
  if(current===2){
    const missing=["luce","colore","pennellata","istante"].filter(id=>!nonEmpty(id));
    if(missing.length){showError("Completate tutti e quattro gli indizi prima di continuare.",missing.map(id=>$(id)));return false}
  }
  if(current===3){
    const miss=[]; if(!nonEmpty("proof")) miss.push($("proofChoices")); if(!nonEmpty("why")) miss.push($("why"));
    if(miss.length){showError("Scegliete l’indizio più convincente e motivate la scelta.",miss);return false}
  }
  if(current===4){
    const miss=[]; if(!nonEmpty("agree")) miss.push($("agreeChoices")); if($("agree").value==="No"&&!nonEmpty("different")) miss.push($("different")); if(!nonEmpty("decision")) miss.push($("decision"));
    if(miss.length){showError("Completate il confronto del gruppo prima di continuare.",miss);return false}
  }
  if(current===5){
    if(!nonEmpty("conclusion")){showError("Scrivete la conclusione del gruppo prima di terminare.",[$("conclusion")]);return false}
  }
  return true;
}
$("next").onclick=()=>{if(validateStep()&&current<5){current++;show()}};$("prev").onclick=()=>{if(current>0){current--;show()}}
function selectButtons(container,value){[...$(container).querySelectorAll("button")].forEach(b=>b.classList.toggle("selected",b.dataset.value===value))}
$("proofChoices").onclick=e=>{if(e.target.dataset.value){$("proof").value=e.target.dataset.value;selectButtons("proofChoices",$("proof").value);save()}}
$("agreeChoices").onclick=e=>{if(e.target.dataset.value){$("agree").value=e.target.dataset.value;selectButtons("agreeChoices",$("agree").value);$("differentWrap").hidden=$("agree").value!=="No";save()}}
document.addEventListener("input",save);
const dlg=$("artDialog"); const open=()=>dlg.showModal(); $("openArt").onclick=open;$("artBtn").onclick=open;$("closeArt").onclick=()=>dlg.close();
$("sendBtn").onclick=async()=>{
 if(!validateStep()) return;
 save(); const endpoint=window.APP_CONFIG?.endpoint||"";
 if(!endpoint){$("status").textContent="Prototipo pronto. Per inviare le risposte al docente va collegato Google Sheets tramite config.js.";return}
 const d=JSON.parse(localStorage.getItem("detectiveDegas")||"{}"); d.opera="Edgar Degas – La classe di danza, 1874"; d.timestamp=new Date().toISOString();
 $("status").textContent="Invio in corso…";
 try{await fetch(endpoint,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain"},body:JSON.stringify(d)});$("status").textContent="Risposte inviate. Grazie!";}catch(e){$("status").textContent="Invio non riuscito. Le risposte restano salvate su questo tablet."}
}
load();show();