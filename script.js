// Hard-coded for your request
const HER_NAME = "Amanda Grajeda";
const SIGNATURE = "Loving You Always! - Damien Gibbs";

// Valentine’s Day target (local time)
const VALENTINE_TARGET = new Date(2026, 1, 14, 0, 0, 0); // Feb=1 in JS

// Typewriter lines
const LINES = [
  `I made this just for you, ${HER_NAME}…`,
  "Because you deserve a love that shows up on purpose.",
  "So I have one important question…"
];

// Love letter (editable!)
const LOVE_LETTER = [
  `Amanda,`,
  `You make life feel softer, brighter, and more meaningful.`,
  `I love the way you exist in my world—your smile, your vibe, your heart, all of it.`,
  `If you’ll let me, I’d love to make this Valentine’s one you’ll never forget.`,
  ``,
  `${SIGNATURE}`
].join("\n");

const typeEl = document.getElementById("typewriter");
const yesBtn = document.getElementById("yesBtn");
const noBtn  = document.getElementById("noBtn");
const msg    = document.getElementById("message");

const modal = document.getElementById("modal");
const closeBtn = document.getElementById("closeBtn");
const copyBtn = document.getElementById("copyBtn");
const picked = document.getElementById("picked");
const loveLetterEl = document.getElementById("loveLetter");

const datePick = document.getElementById("datePick");
const timePick = document.getElementById("timePick");

const cdDays = document.getElementById("cdDays");
const cdHours = document.getElementById("cdHours");
const cdMins = document.getElementById("cdMins");
const cdSecs = document.getElementById("cdSecs");
const cdNote = document.getElementById("cdNote");

// Floating hearts background
const floatLayer = document.querySelector(".float-layer");
spawnFloatingHearts(18);

// Typewriter effect
typewriterSequence(LINES);

// Countdown
startCountdown();

// Prefill pickers to a nice default (Valentine’s Day 7:00 PM if still upcoming)
prefillPickerDefaults();

// Keep current selections in memory
let selectedIdea = "";

// YES click: big moment + modal + confetti + heart burst
yesBtn.addEventListener("click", () => {
  msg.innerHTML = `I’m smiling HARD right now 😭💖<br/>Okay… we’re making this special.`;
  heartBurst();
  confettiBurst(220);
  openModal();
});

// NO button dodges
function moveNoButton() {
  const pad = 16;
  const rect = noBtn.getBoundingClientRect();
  const maxX = window.innerWidth - rect.width - pad;
  const maxY = window.innerHeight - rect.height - pad;

  const x = Math.max(pad, Math.floor(Math.random() * maxX));
  const y = Math.max(pad, Math.floor(Math.random() * maxY));

  noBtn.style.position = "fixed";
  noBtn.style.left = `${x}px`;
  noBtn.style.top  = `${y}px`;
}
noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  moveNoButton();
}, { passive:false });

// Modal controls
closeBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

// Idea selection
document.querySelectorAll(".chip").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedIdea = btn.getAttribute("data-idea") || "";
    updatePickedLine();
    confettiBurst(90);
  });
});

// Update line when date/time changes
datePick.addEventListener("change", updatePickedLine);
timePick.addEventListener("change", updatePickedLine);

// Copy reply
copyBtn.addEventListener("click", async () => {
  const reply = buildReplyText();
  try{
    await navigator.clipboard.writeText(reply);
    picked.textContent = "Copied! ✅ Paste it into a text to Damien 😌💖";
  }catch{
    picked.textContent = `Copy this manually:\n${reply}`;
  }
});

// ---------- Countdown ----------

function startCountdown(){
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

function updateCountdown(){
  const now = new Date();
  const diff = VALENTINE_TARGET.getTime() - now.getTime();

  if (diff <= 0){
    cdDays.textContent = "0";
    cdHours.textContent = "0";
    cdMins.textContent = "0";
    cdSecs.textContent = "0";
    cdNote.textContent = "It’s Valentine’s Day 💖";
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  cdDays.textContent = String(days);
  cdHours.textContent = String(hours).padStart(2,"0");
  cdMins.textContent = String(mins).padStart(2,"0");
  cdSecs.textContent = String(secs).padStart(2,"0");

  cdNote.textContent = "Until Feb 14, 2026 💘";
}

// ---------- Modal ----------

function openModal(){
  // Set the love letter
  loveLetterEl.textContent = LOVE_LETTER;

  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");

  // Make sure picked line is up to date
  updatePickedLine();
}

function closeModal(){
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

// ---------- Reply Builder ----------

function buildReplyText(){
  const dt = formatPickedDateTime();
  const idea = selectedIdea ? `Idea: ${selectedIdea}` : "Idea: (you pick 😌)";
  const when = dt ? `When: ${dt}` : "When: (choose a date & time)";
  return `YES 💖 I'm your Valentine!\n${idea}\n${when}`;
}

function updatePickedLine(){
  const dt = formatPickedDateTime();
  const parts = [];
  if (selectedIdea) parts.push(`✅ Picked: ${selectedIdea}`);
  if (dt) parts.push(`🗓️ ${dt}`);
  picked.textContent = parts.length
    ? parts.join("  •  ") + "  — hit “Copy my reply” 💬"
    : "Pick an idea + date/time (optional), then copy your reply 💬";
}

function formatPickedDateTime(){
  const d = datePick.value; // YYYY-MM-DD
  const t = timePick.value; // HH:MM
  if (!d && !t) return "";

  // If date exists, format nicely
  if (d){
    const [yy, mm, dd] = d.split("-").map(Number);
    const dateObj = new Date(yy, mm-1, dd);
    const datePretty = dateObj.toLocaleDateString(undefined, { weekday:"long", month:"long", day:"numeric", year:"numeric" });

    if (t){
      const [hh, min] = t.split(":").map(Number);
      const temp = new Date(yy, mm-1, dd, hh, min);
      const timePretty = temp.toLocaleTimeString(undefined, { hour:"numeric", minute:"2-digit" });
      return `${datePretty} at ${timePretty}`;
    }
    return datePretty;
  }

  // If only time exists
  return `at ${t}`;
}

function prefillPickerDefaults(){
  const now = new Date();
  if (now.getTime() < VALENTINE_TARGET.getTime()){
    // Prefill: Feb 14, 2026 at 19:00
    datePick.value = "2026-02-14";
    timePick.value = "19:00";
  }
}

// ---------- Typewriter ----------

async function typewriterSequence(lines){
  typeEl.textContent = "";
  for (let i=0; i<lines.length; i++){
    await typeLine(lines[i], 26);
    await sleep(700);
    if (i < lines.length - 1){
      typeEl.textContent = "";
      await sleep(150);
    }
  }
  typeEl.textContent = `Okay ${HER_NAME}… ready? 💘`;
}

function typeLine(text, speed=25){
  return new Promise(resolve => {
    let i = 0;
    typeEl.textContent = "";
    const t = setInterval(() => {
      typeEl.textContent += text[i] || "";
      i++;
      if (i > text.length){
        clearInterval(t);
        resolve();
      }
    }, speed);
  });
}

function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

// ---------- Effects ----------

function confettiBurst(count = 160) {
  const emojis = ["💖","💘","💝","💗","💞","✨"];
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.textContent = emojis[Math.floor(Math.random()*emojis.length)];
    s.style.position = "fixed";
    s.style.left = Math.random()*100 + "vw";
    s.style.top = "-5vh";
    s.style.fontSize = (12 + Math.random()*18) + "px";
    s.style.pointerEvents = "none";
    s.style.filter = "drop-shadow(0 10px 18px rgba(0,0,0,.35))";
    s.style.transition = "transform 1.9s linear, opacity 1.9s linear";
    document.body.appendChild(s);

    const drift = (Math.random()*2 - 1) * 210;
    const fall = 120 + Math.random()*20;

    requestAnimationFrame(() => {
      s.style.transform = `translate(${drift}px, ${fall}vh) rotate(${Math.random()*720}deg)`;
      s.style.opacity = "0";
    });

    setTimeout(() => s.remove(), 2000);
  }
}

function heartBurst(){
  const hearts = ["💖","💘","💗","💞"];
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;

  for (let i=0; i<28; i++){
    const h = document.createElement("span");
    h.textContent = hearts[Math.floor(Math.random()*hearts.length)];
    h.style.position = "fixed";
    h.style.left = cx + "px";
    h.style.top = cy + "px";
    h.style.fontSize = (14 + Math.random()*18) + "px";
    h.style.pointerEvents = "none";
    h.style.transition = "transform 1.25s ease-out, opacity 1.25s ease-out";
    document.body.appendChild(h);

    const angle = Math.random() * Math.PI * 2;
    const dist = 90 + Math.random() * 150;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;

    requestAnimationFrame(() => {
      h.style.transform = `translate(${dx}px, ${dy}px) rotate(${Math.random()*360}deg)`;
      h.style.opacity = "0";
    });

    setTimeout(() => h.remove(), 1400);
  }
}

function spawnFloatingHearts(n=14){
  const icons = ["💗","💖","💘","💞","✨"];
  for (let i=0; i<n; i++){
    const e = document.createElement("div");
    e.textContent = icons[Math.floor(Math.random()*icons.length)];
    e.style.position = "absolute";
    e.style.left = Math.random()*100 + "vw";
    e.style.top = (100 + Math.random()*30) + "vh";
    e.style.fontSize = (14 + Math.random()*26) + "px";
    e.style.opacity = (0.22 + Math.random()*0.45).toFixed(2);
    e.style.filter = "drop-shadow(0 14px 20px rgba(0,0,0,.25))";
    e.style.animation = `floatUp ${10 + Math.random()*12}s linear infinite`;
    e.style.userSelect = "none";
    floatLayer.appendChild(e);
  }

  if (!document.getElementById("floatKeyframes")){
    const style = document.createElement("style");
    style.id = "floatKeyframes";
    style.textContent = `
      @keyframes floatUp{
        from{ transform: translateY(0); }
        to{ transform: translateY(-145vh); }
      }
    `;
    document.head.appendChild(style);
  }
}

