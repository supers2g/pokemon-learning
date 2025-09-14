<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Spelling Numbers Adventure — Finn's Game</title>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>
    :root {
      --primary: #2563eb;
      --primary-dark: #1d4ed8;
      --secondary: #10b981;
      --accent: #f59e0b;
      --danger: #ef4444;
      --surface: rgba(255, 255, 255, 0.95);
      --surface-dark: rgba(255, 255, 255, 0.8);
      --text: #1f2937;
      --text-light: #6b7280;
      --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      --border-radius: 12px;
      --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    * {
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      margin: 0;
      min-height: 100vh;
      color: var(--text);
      overflow-x: hidden;
    }
    body::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image:
        radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.3) 0%, transparent 50%);
      pointer-events: none;
      z-index: -1;
    }
    .screen {
      padding: 20px;
      display: none;
      max-width: 900px;
      margin: 0 auto;
      animation: fadeIn 0.4s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes bounce {
      0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
      40%, 43% { transform: translate3d(0,-15px,0); }
      70% { transform: translate3d(0,-8px,0); }
      90% { transform: translate3d(0,-3px,0); }
    }
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 5px var(--accent), 0 0 10px var(--accent), 0 0 15px var(--accent); }
      50% { box-shadow: 0 0 10px var(--accent), 0 0 20px var(--accent), 0 0 30px var(--accent); }
    }
    h1, h2 {
      margin: 0 0 20px 0;
      text-align: center;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 700;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
    }
    h1 { font-size: 2.5rem; margin-bottom: 10px; }
    h2 { font-size: 2rem; }
    button {
      background: linear-gradient(135deg, var(--primary), var(--primary-dark));
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: var(--border-radius);
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: var(--transition);
      box-shadow: var(--shadow);
      position: relative;
      overflow: hidden;
      min-height: 44px;
      min-width: 44px;
    }
    button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.5s;
    }
    button:hover::before {
      left: 100%;
    }
    button:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }
    button:active {
      transform: translateY(0);
    }
    button.secondary {
      background: linear-gradient(135deg, var(--secondary), #059669);
    }
    button.accent {
      background: linear-gradient(135deg, var(--accent), #d97706);
    }
    button.danger {
      background: linear-gradient(135deg, var(--danger), #dc2626);
    }
    .card {
      background: var(--surface);
      backdrop-filter: blur(10px);
      border-radius: var(--border-radius);
      padding: 20px;
      margin: 15px 0;
      box-shadow: var(--shadow);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: var(--transition);
    }
    .card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }
    .small {
      font-size: 0.95rem;
      color: var(--text-light);
    }
    .center {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 10px;
    }
    #game .question {
      font-size: 1.8rem;
      margin: 20px 0;
      text-align: center;
      font-weight: 600;
      color: var(--text);
      animation: slideIn 0.4s ease-out;
    }
    .options {
      margin: 20px 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
    }
    .options button {
      width: 100%;
      padding: 15px 20px;
      font-size: 1.1rem;
      text-align: left;
      animation: slideIn 0.4s ease-out;
      animation-delay: calc(var(--i) * 0.1s);
    }
    #inputRow {
      margin-top: 20px;
      gap: 15px;
    }
    input[type=text] {
      padding: 12px 16px;
      border-radius: var(--border-radius);
      border: 2px solid rgba(255, 255, 255, 0.3);
      background: var(--surface);
      backdrop-filter: blur(10px);
      font-size: 1.1rem;
      min-width: 200px;
      transition: var(--transition);
    }
    input[type=text]:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
    .creature-popup {
      background: var(--surface);
      backdrop-filter: blur(15px);
      padding: 20px;
      border-radius: var(--border-radius);
      border: 2px solid var(--accent);
      margin: 20px 0;
      text-align: center;
      animation: bounce 0.8s ease-out;
      box-shadow: var(--shadow-lg);
    }
    .creature-img {
      width: 100px;
      height: 100px;
      object-fit: contain;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
      transition: var(--transition);
    }
    .creature-img:hover {
      transform: scale(1.1);
    }
    #collectionBar {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 20px;
      padding: 15px;
      background: var(--surface-dark);
      backdrop-filter: blur(10px);
      border-radius: var(--border-radius);
      min-height: 80px;
      gap: 10px;
    }
    .collection-creature {
      width: 80px;
      height: 100px;
      background: white;
      border-radius: 10px;
      border: 3px solid transparent;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 8px;
      transition: var(--transition);
      position: relative;
      overflow: hidden;
    }
    .collection-creature::before {
      content: '';
      position: absolute;
      inset: 0;
      padding: 3px;
      background: linear-gradient(45deg, var(--primary), var(--secondary), var(--accent));
      border-radius: inherit;
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      mask-composite: xor;
    }
    .collection-creature:hover {
      transform: translateY(-5px) rotate(2deg);
      box-shadow: var(--shadow-lg);
    }
    .collection-creature img {
      width: 50px;
      height: 50px;
      transition: var(--transition);
    }
    .collection-creature:hover img {
      transform: scale(1.2);
    }
    #mapGrid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(45px, 1fr));
      gap: 8px;
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
    .map-tile {
      aspect-ratio: 1;
      background: var(--surface);
      backdrop-filter: blur(10px);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.9rem;
      transition: var(--transition);
      border: 2px solid rgba(255, 255, 255, 0.2);
    }
    .map-tile:hover {
      transform: scale(1.1);
    }
    .map-tile.completed {
      background: linear-gradient(135deg, var(--secondary), #059669);
      color: white;
      animation: glow 2s infinite;
    }
    #dexGrid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 15px;
      padding: 20px;
    }
    .dex-creature {
      background: white;
      border-radius: var(--border-radius);
      border: 4px solid #e5e7eb;
      padding: 15px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transition: var(--transition);
      position: relative;
      overflow: hidden;
    }
    .dex-creature::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
      transition: left 0.8s;
    }
    .dex-creature:hover::before {
      left: 100%;
    }
    .dex-creature.locked img {
      filter: grayscale(100%) brightness(0.6);
    }
    .dex-creature.locked div {
      color: #9ca3af;
    }
    .dex-common { border-color: var(--secondary); }
    .dex-rare { border-color: var(--primary); }
    .dex-legendary {
      border-color: var(--accent);
      background: linear-gradient(135deg, #fef3c7, #fff7ed);
    }
    .dex-creature:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-lg);
    }
    #feedback {
      min-height: 30px;
      margin: 15px 0;
      color: var(--text);
      font-weight: 500;
      text-align: center;
      padding: 10px;
      border-radius: var(--border-radius);
      background: var(--surface-dark);
      backdrop-filter: blur(10px);
    }
    .settings-row {
      display: flex;
      gap: 15px;
      align-items: center;
      justify-content: center;
      margin: 20px 0;
      flex-wrap: wrap;
    }
    .settings-row label {
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--surface);
      padding: 10px 15px;
      border-radius: var(--border-radius);
      cursor: pointer;
      transition: var(--transition);
    }
    .settings-row label:hover {
      background: var(--surface-dark);
    }
    input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: var(--primary);
    }
    #achievementsList {
      margin: 15px 0;
      padding: 15px;
      background: var(--surface);
      backdrop-filter: blur(10px);
      border-radius: var(--border-radius);
      font-size: 0.9rem;
      color: var(--text-light);
      text-align: center;
    }
    .egg {
      width: 70px;
      height: 90px;
      background: linear-gradient(135deg, #fef3c7, #fbbf24);
      border: 3px dashed var(--accent);
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      position: relative;
      animation: bounce 2s infinite;
      transition: var(--transition);
    }
    .egg:hover {
      transform: scale(1.1);
    }
    .egg-timer {
      position: absolute;
      bottom: -25px;
      font-size: 0.75rem;
      color: var(--text);
      background: var(--surface);
      padding: 4px 8px;
      border-radius: 6px;
      white-space: nowrap;
    }
    #eggsBar {
      margin-top: 15px;
      gap: 15px;
    }
    .small-muted {
      font-size: 0.85rem;
      color: var(--text-light);
    }
    /* Mobile improvements */
    @media (max-width: 768px) {
      .screen { padding: 15px; }
      h1 { font-size: 2rem; }
      h2 { font-size: 1.5rem; }
      button {
        padding: 14px 20px;
        font-size: 1rem;
      }
      .options button {
        padding: 16px 20px;
        font-size: 1rem;
      }
      #game .question {
        font-size: 1.5rem;
      }
      input[type=text] {
        min-width: 150px;
        font-size: 16px; /* Prevents zoom on iOS */
      }
      #mapGrid {
        grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
        gap: 6px;
        padding: 15px;
      }
      #dexGrid {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 10px;
        padding: 15px;
      }
    }
    /* Loading animation */
    .loading {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 3px solid rgba(255,255,255,.3);
      border-radius: 50%;
      border-top-color: var(--primary);
      animation: spin 1s ease-in-out infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    /* Success/error states */
    .feedback-success {
      background: linear-gradient(135deg, #dcfce7, #bbf7d0);
      color: #166534;
      border-left: 4px solid var(--secondary);
    }
    .feedback-error {
      background: linear-gradient(135deg, #fecaca, #fca5a5);
      color: #991b1b;
      border-left: 4px solid var(--danger);
    }
    .feedback-hint {
      background: linear-gradient(135deg, #fef3c7, #fde68a);
      color: #92400e;
      border-left: 4px solid var(--accent);
    }
  </style>
</head>
<body>
  <div id="menu" class="screen">
    <h1>🎮 Spelling Numbers Adventure</h1>
    <div class="card">
      <div class="small center">Help Finn spell numbers 1–200. Collect Pokémon, hatch eggs, beat Team Rocket, and fill the Pokédex!</div>
    </div>
    <div class="center">
      <button id="playBtn">🚀 Play</button>
      <button id="mapBtn" class="secondary">🗺️ Progress Map</button>
      <button id="dexBtn" class="accent">📖 Pokédex</button>
      <button id="analyticsBtn">📊 Analytics</button>
    </div>
  </div>
  <div id="game" class="screen">
    <div class="card">
      <div class="small center">Difficulty: <strong id="difficultyLabel">Easy</strong></div>
    </div>
    <div id="question" class="question">&nbsp;</div>
    <div id="options" class="options"></div>
    <div id="inputRow" style="display:none" class="center">
      <input id="answerInput" type="text" placeholder="Type your answer" />
      <button id="submitBtn">Submit</button>
    </div>
    <div id="encounterArea" class="center"></div>
    <div id="feedback" class="small center"></div>
    <div class="center"><button id="continueBtn">Continue</button></div>
    <div id="collectionBar"></div>
    <div id="eggsBar" class="center"></div>
    <div id="achievementsList" class="small-muted center"></div>
    <div class="center"><button id="quitBtn" class="danger">Quit to menu</button></div>
  </div>
  <div id="map" class="screen">
    <h2>🗺️ Progress Map</h2>
    <div class="card">
      <div id="mapGrid"></div>
    </div>
    <div class="center"><button id="backFromMap">Back</button></div>
  </div>
  <div id="dex" class="screen">
    <h2>📖 Your Pokédex</h2>
    <div id="dexGrid"></div>
    <div class="center"><button id="backFromDex">Back</button></div>
  </div>
  <div id="analytics" class="screen">
    <h2>📊 Parent Analytics & Settings</h2>
    <div class="card">
      <div id="analyticsContent"></div>
    </div>
    <div class="settings-row">
      <label><input id="soundToggle" type="checkbox" /> 🔊 Play sounds & speech</label>
      <button id="resetBtn" class="danger">🔄 Reset progress</button>
    </div>
    <div class="center"><button id="backFromAnalytics">Back</button></div>
  </div>
  <div id="rocketBattle" class="screen">
    <h2>🚀 Team Rocket Battle!</h2>
    <div class="card">
      <div id="rocketQuestion" class="question"></div>
      <div id="rocketOptions" class="options"></div>
      <div id="rocketFeedback" class="small center"></div>
    </div>
    <div class="center"><button id="forfeitRocket" class="danger">Give Up</button></div>
  </div>
<script>
/* ---------- Data & state ---------- */
const MAX_NUM = 200;
const numbers = Array.from({length:MAX_NUM}, (_,i)=>i+1);
// Gen 1 names (151) - used for collection/dex
const pokemonNames = ["Bulbasaur","Ivysaur","Venusaur","Charmander","Charmeleon","Charizard","Squirtle","Wartortle","Blastoise","Caterpie","Metapod","Butterfree","Weedle","Kakuna","Beedrill","Pidgey","Pidgeotto","Pidgeot","Rattata","Raticate","Spearow","Fearow","Ekans","Arbok","Pikachu","Raichu","Sandshrew","Sandslash","Nidoran♀","Nidorina","Nidoqueen","Nidoran♂","Nidorino","Nidoking","Clefairy","Clefable","Vulpix","Ninetales","Jigglypuff","Wigglytuff","Zubat","Golbat","Oddish","Gloom","Vileplume","Paras","Parasect","Venonat","Venomoth","Diglett","Dugtrio","Meowth","Persian","Psyduck","Golduck","Mankey","Primeape","Growlithe","Arcanine","Poliwag","Poliwhirl","Poliwrath","Abra","Kadabra","Alakazam","Machop","Machoke","Machamp","Bellsprout","Weepinbell","Victreebel","Tentacool","Tentacruel","Geodude","Graveler","Golem","Ponyta","Rapidash","Slowpoke","Slowbro","Magnemite","Magneton","Farfetch'd","Doduo","Dodrio","Seel","Dewgong","Grimer","Muk","Shellder","Cloyster","Gastly","Haunter","Gengar","Onix","Drowzee","Hypno","Krabby","Kingler","Voltorb","Electrode","Exeggcute","Exeggutor","Cubone","Marowak","Hitmonlee","Hitmonchan","Lickitung","Koffing","Weezing","Rhyhorn","Rhydon","Chansey","Tangela","Kangaskhan","Horsea","Seadra","Goldeen","Seaking","Staryu","Starmie","Mr. Mime","Scyther","Jynx","Electabuzz","Magmar","Pinsir","Tauros","Magikarp","Gyarados","Lapras","Ditto","Eevee","Vaporeon","Jolteon","Flareon","Porygon","Omanyte","Omastar","Kabuto","Kabutops","Aerodactyl","Snorlax","Articuno","Zapdos","Moltres","Dratini","Dragonair","Dragonite","Mewtwo","Mew"];
const creatures = pokemonNames.map((name,i)=>({
  id:`poke${i+1}`,
  name,
  img:`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i+1}.png`,
  index:i+1
}));

const LEGENDARIES = new Set([144,145,146,150,151]); // Articuno, Zapdos, Moltres, Mewtwo, Mew
const RARES = new Set([25,131,142]); // example rares (Pikachu, Lapras, Aerodactyl)

const achievements = {
  'first_catch': { name: 'First Catch!', description: 'Caught your first Pokémon' },
  'streak_master': { name: 'Streak Master', description: '20 correct in a row' },
  'legendary_trainer': { name: 'Legendary Trainer', description: 'Caught a legendary' },
  'egg_hatcher': { name: 'Egg Hatcher', description: 'Hatched your first egg' },
  'collector_50': { name: 'Collector', description: 'Caught 50 Pokémon' },
  'rocket_defeated': { name: 'Rocket Buster', description: 'Beat Team Rocket 5 times' },
  'dex_complete': { name: 'Pokédex Master', description: 'Filled the entire Pokédex' },
  'egg_collector': { name: 'Egg Collector', description: 'Collected 10 eggs' },
  'speed_typist': { name: 'Speed Typist', description: 'Answered in under 2 seconds' }
};

const STORAGE_KEY = 'spelling_numbers_finn_v2';
let state = {
  difficulty:1,
  streak:0,
  mastered:[],
  mistakes:{},
  collection:[],
  stolen:[],
  lastQuestion:null,
  correctTotal:0,
  sound:true,
  milestones:[],
  achievementsUnlocked:{},
  eggs:[], // {id, time}
  hatched:[],
  rocketWins:0,
  lastAnswerTimestamp:0
};

function load(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw) state = JSON.parse(raw);
  }catch(e){
    console.warn(e);
  }
}

function save(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

load();

/* ---------- Enhanced helpers ---------- */
function numToWords(n){
  const ones=["","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
  const tens=["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];
  if(n<20) return ones[n];
  if(n<100){
    const t=Math.floor(n/10), o=n%10;
    return tens[t] + (o?"-"+ones[o] : "");
  }
  if(n===100) return 'one hundred';
  if(n<200){
    const r=n-100;
    return 'one hundred' + (r? ' ' + numToWords(r): '');
  }
  if(n===200) return 'two hundred';
  return String(n);
}

function speak(text){
  if(!state.sound) return;
  if('speechSynthesis' in window){
    const u = new SpeechSynthesisUtterance(text);
    const v = speechSynthesis.getVoices().find(v=>/female|zira|susan|kathy/i.test((v.name||'')+ (v.lang||'')+ (v.voiceURI||'')));
    if(v) u.voice = v;
    u.rate = 0.95;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  }
}

function playSound(type){
  if(!state.sound) return;
  try{
    const ctx = new (window.AudioContext||window.webkitAudioContext)();
    if(ctx.state === 'suspended') ctx.resume();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    if(type==='correct'){ o.frequency.value = 880; o.type='sine'; g.gain.value = 0.07; }
    else { o.frequency.value = 220; o.type='sawtooth'; g.gain.value = 0.07; }
    o.start();
    o.stop(ctx.currentTime+0.14);
  }catch(e){}
}

function getRarity(index){
  if(LEGENDARIES.has(index)) return 'legendary';
  if(RARES.has(index) || index>120) return 'rare';
  return 'common';
}

function getCatchChance(index){
  const r = getRarity(index);
  if(r==='legendary') return 0.08;
  if(r==='rare') return 0.28;
  return 0.65;
}

function unlockAchievement(key){
  if(!state.achievementsUnlocked[key]){
    state.achievementsUnlocked[key] = true;
    save();
    showTempMessage(`🏆 Achievement unlocked: ${achievements[key].name}`, 2200);
    renderAchievements();
  }
}

function showTempMessage(msg, ms=1200, type='default'){
  const fb = document.getElementById('feedback');
  fb.textContent = msg;
  fb.className = `small center feedback-${type}`;
  setTimeout(()=>{
    if(fb.textContent === msg) {
      fb.textContent = '';
      fb.className = 'small center';
    }
  }, ms);
}

/* ---------- UI refs ---------- */
const qEl = document.getElementById('question');
const optEl = document.getElementById('options');
const inputRow = document.getElementById('inputRow');
const answerInput = document.getElementById('answerInput');
const encounterArea = document.getElementById('encounterArea');
const feedback = document.getElementById('feedback');
const collectionBar = document.getElementById('collectionBar');
const difficultyLabel = document.getElementById('difficultyLabel');
const continueBtn = document.getElementById('continueBtn');
const eggsBar = document.getElementById('eggsBar');
const soundToggle = document.getElementById('soundToggle');
let gameTimerInterval = null;

/* ---------- Question & difficulty flow ---------- */
let retryState = null; // null | {hinted: true} | 'force' (must type correct)
let lastQuestionStart = 0;

function updateDifficultyLabel(){
  const map = {1:'Easy (MC)',2:'Medium (Fill)',3:'Hard (Type)',4:'Number Match'};
  difficultyLabel.textContent = map[state.difficulty] || 'Mixed';
}

function startGame(){
  state.difficulty = 1;
  state.streak = 0;
  save();
  updateCollectionBar();
  renderEggs();
  renderAchievements();
  if(!gameTimerInterval){
    gameTimerInterval = setInterval(checkEggs, 1000);
  }
  nextQuestion();
  showScreen('game');
}

function quitToMenu(){
  save();
  showScreen('menu');
}

/* weighted creature picker for encounters */
function pickWeightedCreature(){
  const pool = [];
  creatures.forEach(c=>{
    const r = getRarity(c.index);
    let w = (r==='common'?10:(r==='rare'?4:1));
    if(state.correctTotal>50 && r==='rare') w += 3;
    if(state.correctTotal>120 && r==='legendary') w += 2;
    for(let i=0;i<w;i++) pool.push(c);
  });
  return pool[Math.floor(Math.random()*pool.length)];
}

function chooseNumber(){
  const pool = [];
  for(let n of numbers){
    const mastered = state.mastered.includes(n);
    const mistakes = state.mistakes[n]||0;
    const m = mastered?1:3;
    const weight = Math.max(1, m + mistakes);
    for(let i=0;i<weight;i++) pool.push(n);
  }
  return pool[Math.floor(Math.random()*pool.length)];
}

function nextQuestion(){
  updateDifficultyLabel();
  feedback.textContent = '';
  feedback.className = 'small center';
  encounterArea.innerHTML = '';
  continueBtn.style.display = 'none';
  inputRow.style.display = 'none';
  optEl.innerHTML = '';
  answerInput.value = '';
  retryState = null;
  lastQuestionStart = Date.now();
  const n = chooseNumber();
  state.lastQuestion = n;
  const word = numToWords(n);
  // Mix types based on difficulty but include numberMatch in mix
  const allowed = ['mc'];
  if(state.difficulty >= 2) allowed.push('fill');
  if(state.difficulty >= 3) allowed.push('type');
  allowed.push('numMatch'); // always mixed in
  const type = allowed[Math.floor(Math.random()*allowed.length)];

  if(type === 'mc'){
    qEl.textContent = `Which is the correct spelling for ${n}?`;
    showMultipleChoice(n, word);
  }
  else if(type === 'fill'){
    qEl.textContent = `Fill in the blanks: ${n}`;
    showFillBlank(n, word);
  }
  else if(type === 'type'){
    qEl.textContent = `Type the full spelling for ${n}`;
    showTyping(n, word);
  }
  else {
    qEl.textContent = `What number is this (type digits)? ${word}`;
    showNumberMatch(n, word);
  }
  speak(word);
}

/* ---------- question renderers ---------- */
function showMultipleChoice(n, word){
  optEl.innerHTML = '';
  const choices = new Set([word]);
  while(choices.size < 4){
    const r = numToWords(numbers[Math.floor(Math.random()*numbers.length)]);
    choices.add(r);
  }
  Array.from(choices).sort(()=>Math.random()-0.5).forEach((c, i)=>{
    const b = document.createElement('button');
    b.textContent = c;
    b.style.setProperty('--i', i);
    b.onclick = ()=> submitChoice(c);
    optEl.appendChild(b);
  });
}

function showFillBlank(n, word){
  optEl.textContent = '';
  let arr = word.split('');
  for(let i=0;i<arr.length;i++){
    if(arr[i] !== ' ' && Math.random()<0.45) arr[i] = '_';
  }
  optEl.textContent = arr.join('');
  inputRow.style.display = 'flex';
  answerInput.focus();
}

function showTyping(n, word){
  optEl.innerHTML = '';
  inputRow.style.display = 'flex';
  answerInput.focus();
}

function showNumberMatch(n, word){
  optEl.innerHTML = '';
  inputRow.style.display = 'flex';
  answerInput.focus();
}

/* ---------- submission & retry logic ---------- */
function submitChoice(selected){
  const correct = numToWords(state.lastQuestion);
  if(selected === correct) return handleCorrect();
  else return handleWrong(correct);
}

function submitAnswer(){
  const valRaw = answerInput.value.trim();
  if(!valRaw){ showTempMessage('Please enter an answer!', 1000, 'hint'); return; }
  const val = valRaw.toLowerCase();
  const correctWord = numToWords(state.lastQuestion);
  // detect number input
  const isDigits = /^\d+$/.test(valRaw);
  // if currently in forced-correct mode, require exact match (word or digits)
  if(retryState === 'force'){
    if(isDigits){
      if(parseInt(valRaw,10)===state.lastQuestion) return handleCorrect();
      else { showTempMessage(`Please type the correct answer exactly.`, 1500, 'hint'); return; }
    } else {
      if(val === correctWord) return handleCorrect();
      else { showTempMessage(`Please type the correct answer exactly.`, 1500, 'hint'); return; }
    }
  }
  // normal attempt: if digits expected and match
  if(isDigits){
    if(parseInt(valRaw,10)===state.lastQuestion) return handleCorrect();
    else return handleWrong(String(state.lastQuestion));
  } else {
    if(val === correctWord) return handleCorrect();
    else return handleWrong(correctWord);
  }
}

function handleCorrect(){
  const timeTaken = Date.now() - lastQuestionStart;
  if(timeTaken < 2000) unlockAchievement('speed_typist');
  state.streak++;
  state.correctTotal++;
  playSound('correct');
  // increase difficulty over time
  if(state.streak >= 5 && state.difficulty < 3){ state.difficulty++; state.streak = 0; }
  if(!state.mastered.includes(state.lastQuestion)) state.mastered.push(state.lastQuestion);
  save();
  showTempMessage('Excellent!', 800, 'success');
  // evolution on long streaks (naive)
  if(state.streak >= 10){ triggerEvolution(); state.streak = 0; }
  // Team Rocket trigger every 20 correct answers
  if(state.correctTotal > 0 && state.correctTotal % 20 === 0){
    triggerRocketBattle();
    return;
  }
  // chance to give an egg sometimes (small chance)
  if(Math.random() < 0.08) giveEgg();
  maybeEncounter();
  if(!encounterArea.hasChildNodes()) setTimeout(()=> nextQuestion(), 700);
}

function handleWrong(correct){
  // first wrong: give hint (first letter) and allow retry
  state.streak = 0;
  playSound('wrong');
  state.mistakes[state.lastQuestion] = (state.mistakes[state.lastQuestion] || 0) + 1;
  save();
  if(!retryState){
    retryState = {hinted:true};
    showTempMessage(`Hint: it starts with "${String(correct)[0]}" — try again.`, 3000, 'hint');
    // If it was a multiple choice, show choices again (they remain).
    // For typed input, leave input visible and ask again:
    inputRow.style.display = 'flex';
  } else if(retryState && retryState.hinted){
    // second wrong: show correct answer and force the player to type it before continuing
    retryState = 'force';
    showTempMessage(`Type the correct answer now to continue: ${correct}`, 5000, 'error');
    inputRow.style.display = 'flex';
  } else {
    // fallback
    retryState = 'force';
    showTempMessage(`Type the correct answer to continue: ${correct}`, 5000, 'error');
    inputRow.style.display = 'flex';
  }
}

/* ---------- encounters & catching ---------- */
function maybeEncounter(){
  const chance = 0.30;
  if(Math.random() > chance) return;
  // chance to recatch stolen
  if(state.stolen.length > 0 && Math.random() < 0.35){
    const stolenId = state.stolen[Math.floor(Math.random()*state.stolen.length)];
    const crit = creatures.find(c => c.id === stolenId);
    if(crit) return spawnEncounter(crit, true);
  }
  const crit = pickWeightedCreature();
  if(getRarity(crit.index) === 'legendary'){
    if(!state.milestones.includes('legendary-'+crit.index) && Math.random() > 0.12) return;
  }
  spawnEncounter(crit, false);
}

function spawnEncounter(crit, isStolen=false){
  encounterArea.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'creature-popup';
  wrap.innerHTML = `<div class="center"><img src="${crit.img}" class="creature-img" alt="${crit.name}"></div>
    <div class="small center">${isStolen? 'A stolen' : 'A wild'} <strong>${crit.name}</strong> appeared!</div>
    <div class="small-muted center">Rarity: ${getRarity(crit.index)}</div>`;
  const btnCatch = document.createElement('button');
  btnCatch.textContent = '⚡ Catch!';
  btnCatch.className = 'secondary';
  const btnRun = document.createElement('button');
  btnRun.textContent = '🏃 Let it go';
  wrap.appendChild(btnCatch);
  wrap.appendChild(btnRun);
  encounterArea.appendChild(wrap);

  let resolved = false;
  const timeout = setTimeout(()=> {
    if(resolved) return;
    resolved = true;
    encounterArea.innerHTML = `<div class="small center">Oh no — ${crit.name} got away!</div>`;
    setTimeout(()=> { encounterArea.innerHTML=''; nextQuestion(); }, 900);
  }, 4500);

  btnCatch.onclick = ()=>{
    if(resolved) return;
    resolved = true;
    clearTimeout(timeout);
    const chance = getCatchChance(crit.index);
    const success = Math.random() < chance;
    if(success){
      if(isStolen){
        const idx = state.stolen.indexOf(crit.id);
        if(idx >= 0) state.stolen.splice(idx,1);
        addToCollection(crit.id);
        encounterArea.innerHTML = `<div class="small center">🎉 You recaught <strong>${crit.name}</strong>!</div>`;
      } else {
        addToCollection(crit.id);
        encounterArea.innerHTML = `<div class="small center">🎉 You caught <strong>${crit.name}</strong>!</div>`;
        if(getRarity(crit.index) === 'legendary') state.milestones.push('legendary-'+crit.index);
      }
      save();
      setTimeout(()=> { encounterArea.innerHTML=''; nextQuestion(); }, 1000);
    } else {
      encounterArea.innerHTML = `<div class="small center">💨 Oh no — ${crit.name} escaped!</div>`;
      setTimeout(()=> { encounterArea.innerHTML=''; nextQuestion(); }, 900);
    }
  };

  btnRun.onclick = ()=>{
    if(resolved) return;
    resolved = true;
    clearTimeout(timeout);
    encounterArea.innerHTML = `<div class="small center">👋 You let ${crit.name} go.</div>`;
    setTimeout(()=> { encounterArea.innerHTML=''; nextQuestion(); }, 700);
  };
}

function addToCollection(id){
  if(!state.collection.includes(id)){
    state.collection.push(id);
    // achievements
    if(state.collection.length === 1) unlockAchievement('first_catch');
    if(state.collection.length >= 50) unlockAchievement('collector_50');
    const crit = creatures.find(c=>c.id === id);
    if(crit && LEGENDARIES.has(crit.index)) unlockAchievement('legendary_trainer');
    if(state.collection.length === creatures.length) unlockAchievement('dex_complete');
    save();
    updateCollectionBar();
  } else {
    showTempMessage('You already have that one!', 900, 'hint');
  }
}

function updateCollectionBar(){
  collectionBar.innerHTML = '';
  state.collection.forEach(cid=>{
    const c = creatures.find(x=>x.id===cid);
    if(!c) return;
    const el = document.createElement('div');
    el.className = 'collection-creature';
    el.title = c.name;
    el.innerHTML = `<img src="${c.img}" alt="${c.name}">
                     <div class="small-muted">${c.name}</div>`;
    collectionBar.appendChild(el);
  });
}

/* ---------- Eggs & hatching ---------- */
function giveEgg(){
  const minutes = 2 + Math.floor(Math.random()*4); // 2-5 min hatch time
  const hatchTime = Date.now() + minutes * 60 * 1000;
  const egg = { id: `egg${Date.now()}`, hatchTime, critId: pickWeightedCreature().id };
  state.eggs.push(egg);
  save();
  showTempMessage('An egg has been added to your collection! 🥚', 2000, 'hint');
  if(state.eggs.length >= 10) unlockAchievement('egg_collector');
  renderEggs();
}

function renderEggs(){
  eggsBar.innerHTML = '';
  state.eggs.forEach(egg=>{
    const eggEl = document.createElement('div');
    eggEl.className = 'egg';
    const secondsLeft = Math.floor((egg.hatchTime - Date.now())/1000);
    const minutesLeft = Math.ceil(secondsLeft / 60);
    eggEl.innerHTML = `🐣<div class="egg-timer">${minutesLeft} min</div>`;
    eggsBar.appendChild(eggEl);
  });
}

function checkEggs(){
  const now = Date.now();
  const hatchedEggs = state.eggs.filter(e => now >= e.hatchTime);
  const remainingEggs = state.eggs.filter(e => now < e.hatchTime);
  state.eggs = remainingEggs;

  hatchedEggs.forEach(egg => {
    state.hatched.push(egg.critId);
    addToCollection(egg.critId);
    const crit = creatures.find(c => c.id === egg.critId);
    if(crit){
      showTempMessage(`🎉 Your egg hatched a ${crit.name}!`, 3000, 'success');
      unlockAchievement('egg_hatcher');
    }
  });

  if(hatchedEggs.length > 0){
    save();
    renderEggs();
    updateCollectionBar();
  }
}

/* ---------- Evolution & Team Rocket ---------- */
function triggerEvolution(){
  const potentialEvo = state.collection.find(cid=>{
    const crit = creatures.find(c=>c.id===cid);
    if(crit && crit.index < 100 && (crit.index % 10 === 0)) return true; // simplified evo logic
    return false;
  });
  if(potentialEvo){
    const crit = creatures.find(c=>c.id === potentialEvo);
    const nextCrit = creatures.find(c=>c.index === crit.index + 1);
    if(nextCrit){
      state.collection = state.collection.filter(id=>id!==crit.id);
      addToCollection(nextCrit.id);
      showTempMessage(`✨ ${crit.name} evolved into ${nextCrit.name}!`, 2500, 'success');
    }
  }
}

let rocketBattleCorrect = 0;
let rocketBattleQuestion = null;
function triggerRocketBattle(){
  showScreen('rocketBattle');
  const rocketWords = ['one hundred', 'one thousand', 'one million'];
  const rocketWord = rocketWords[Math.floor(Math.random() * rocketWords.length)];
  rocketBattleQuestion = rocketWord;
  document.getElementById('rocketQuestion').textContent = `Spell this number: ${rocketWord.replace(/\w/g, '_ ')}...`;
  document.getElementById('rocketFeedback').textContent = '';
  rocketBattleCorrect = 0;
  const rocketOptions = document.getElementById('rocketOptions');
  rocketOptions.innerHTML = '';
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Type your answer';
  input.id = 'rocketAnswerInput';
  const btn = document.createElement('button');
  btn.textContent = 'Submit';
  btn.onclick = ()=>{
    const val = input.value.trim().toLowerCase();
    if(val === rocketBattleQuestion){
      rocketBattleCorrect++;
      document.getElementById('rocketFeedback').textContent = 'Correct!';
      if(rocketBattleCorrect >= 3){
        handleRocketVictory();
      } else {
        document.getElementById('rocketQuestion').textContent = `Spell it again! (${3-rocketBattleCorrect} more to go)`;
        input.value = '';
      }
    } else {
      document.getElementById('rocketFeedback').textContent = `Incorrect! Get it right to continue.`;
    }
  };
  rocketOptions.appendChild(input);
  rocketOptions.appendChild(btn);
}

function handleRocketVictory(){
  state.rocketWins++;
  if(state.rocketWins >= 5) unlockAchievement('rocket_defeated');
  showTempMessage(`You defeated Team Rocket! They dropped a Pokémon!`, 3000, 'success');
  const stolenCreature = state.collection[Math.floor(Math.random() * state.collection.length)];
  if(stolenCreature){
    state.stolen.push(stolenCreature);
    state.collection = state.collection.filter(c => c !== stolenCreature);
    showTempMessage(`Oh no! But they stole your ${creatures.find(c=>c.id === stolenCreature).name} back!`, 3000, 'error');
  }
  setTimeout(()=>{
    showScreen('game');
    updateCollectionBar();
    nextQuestion();
  }, 1000);
}

/* ---------- screens & navigation ---------- */
function showScreen(id){
  document.querySelectorAll('.screen').forEach(el=>el.style.display='none');
  document.getElementById(id).style.display = 'block';
  if(id === 'game'){
    updateCollectionBar();
    renderEggs();
    renderAchievements();
    updateDifficultyLabel();
  }
  if(id === 'map') renderMap();
  if(id === 'dex') renderDex();
  if(id === 'analytics') renderAnalytics();
}

/* ---------- analytics & settings ---------- */
function renderMap(){
  const mapGrid = document.getElementById('mapGrid');
  mapGrid.innerHTML = '';
  for(let i=1;i<=MAX_NUM;i++){
    const tile = document.createElement('div');
    tile.className = 'map-tile';
    tile.textContent = i;
    if(state.mastered.includes(i)) tile.classList.add('completed');
    mapGrid.appendChild(tile);
  }
}

function renderDex(){
  const dexGrid = document.getElementById('dexGrid');
  dexGrid.innerHTML = '';
  creatures.forEach(c => {
    const el = document.createElement('div');
    el.className = 'dex-creature';
    const isCaught = state.collection.includes(c.id);
    if(!isCaught) el.classList.add('locked');
    const rarity = getRarity(c.index);
    el.classList.add(`dex-${rarity}`);
    el.innerHTML = `
      <img src="${isCaught ? c.img : 'https://placehold.co/50x50/333333/FFFFFF?text=?'}" alt="${isCaught ? c.name : '???'}">
      <div>${isCaught ? c.name : '???'}</div>
      <div class="small-muted">${rarity}</div>
    `;
    dexGrid.appendChild(el);
  });
}

function renderAnalytics(){
  const content = document.getElementById('analyticsContent');
  content.innerHTML = `
    <h3>Overall Progress</h3>
    <p>Correct Answers: <strong>${state.correctTotal}</strong></p>
    <p>Mastered Numbers: <strong>${state.mastered.length} / ${MAX_NUM}</strong></p>
    <p>Pokédex Completion: <strong>${state.collection.length} / ${creatures.length}</strong></p>
    <p>Team Rocket Wins: <strong>${state.rocketWins}</strong></p>
    <p>Eggs Collected: <strong>${state.hatched.length + state.eggs.length}</strong></p>
    <p>Stolen Pokémon: <strong>${state.stolen.length}</strong></p>
    <hr style="margin:20px 0; border: none; border-top: 1px dashed #ccc;">
    <h3>Most Mistakes</h3>
    <ul id="mistakesList"></ul>
  `;
  const mistakesList = document.getElementById('mistakesList');
  const sortedMistakes = Object.entries(state.mistakes).sort(([,a],[,b])=>b-a);
  if(sortedMistakes.length === 0){
    mistakesList.innerHTML = '<li>No mistakes yet!</li>';
  } else {
    sortedMistakes.slice(0, 5).forEach(([num, count])=>{
      const li = document.createElement('li');
      li.textContent = `${num}: ${count} mistakes`;
      mistakesList.appendChild(li);
    });
  }
  // Update sound toggle based on state
  soundToggle.checked = state.sound;
}

function renderAchievements(){
  const list = document.getElementById('achievementsList');
  list.innerHTML = '';
  const unlocked = Object.keys(state.achievementsUnlocked).length;
  if(unlocked === 0){
    list.textContent = 'No achievements unlocked yet.';
    return;
  }
  Object.keys(achievements).forEach(key=>{
    if(state.achievementsUnlocked[key]){
      const span = document.createElement('span');
      span.textContent = `🏆 ${achievements[key].name}`;
      span.style.margin = '0 5px';
      list.appendChild(span);
    }
  });
}

function resetGame(){
  if(confirm("Are you sure you want to reset all your progress?")){
    localStorage.removeItem(STORAGE_KEY);
    state = {
      difficulty:1, streak:0, mastered:[], mistakes:{}, collection:[], stolen:[],
      lastQuestion:null, correctTotal:0, sound:true, milestones:[],
      achievementsUnlocked:{}, eggs:[], hatched:[], rocketWins:0,
      lastAnswerTimestamp:0
    };
    save();
    showTempMessage('Progress has been reset!', 2000, 'danger');
    showScreen('menu');
  }
}

/* ---------- Event Listeners ---------- */
window.onload = function(){
  // Initial screen display
  showScreen('menu');
  // Initialize UI elements and handlers
  soundToggle.checked = state.sound;
  soundToggle.addEventListener('change', (e)=>{
    state.sound = e.target.checked;
    save();
  });
  // Button click handlers
  document.getElementById('playBtn').onclick = startGame;
  document.getElementById('mapBtn').onclick = ()=> showScreen('map');
  document.getElementById('dexBtn').onclick = ()=> showScreen('dex');
  document.getElementById('analyticsBtn').onclick = ()=> showScreen('analytics');
  document.getElementById('backFromMap').onclick = ()=> showScreen('menu');
  document.getElementById('backFromDex').onclick = ()=> showScreen('menu');
  document.getElementById('backFromAnalytics').onclick = ()=> showScreen('menu');
  document.getElementById('quitBtn').onclick = quitToMenu;
  document.getElementById('resetBtn').onclick = resetGame;
  document.getElementById('submitBtn').onclick = submitAnswer;
  document.getElementById('answerInput').onkeydown = (e)=>{ if(e.key==='Enter') submitAnswer(); };
  document.getElementById('continueBtn').onclick = nextQuestion;
  document.getElementById('forfeitRocket').onclick = ()=>{
    showTempMessage('You gave up! Next time!', 2000, 'error');
    setTimeout(()=> showScreen('game'), 500);
  };
  // Initial state check
  updateCollectionBar();
  renderAchievements();
  renderEggs();
  // Start the egg timer
  gameTimerInterval = setInterval(checkEggs, 1000);
};

</script>
</body>
</html>
