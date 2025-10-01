// ========== DATA & STATE ==========
const MAX_NUM = 200;
const numbers = Array.from({length: MAX_NUM}, (_, i) => i + 1);

const pokemonNames = ["Bulbasaur","Ivysaur","Venusaur","Charmander","Charmeleon","Charizard","Squirtle","Wartortle","Blastoise","Caterpie","Metapod","Butterfree","Weedle","Kakuna","Beedrill","Pidgey","Pidgeotto","Pidgeot","Rattata","Raticate","Spearow","Fearow","Ekans","Arbok","Pikachu","Raichu","Sandshrew","Sandslash","Nidoran♀","Nidorina","Nidoqueen","Nidoran♂","Nidorino","Nidoking","Clefairy","Clefable","Vulpix","Ninetales","Jigglypuff","Wigglytuff","Zubat","Golbat","Oddish","Gloom","Vileplume","Paras","Parasect","Venonat","Venomoth","Diglett","Dugtrio","Meowth","Persian","Psyduck","Golduck","Mankey","Primeape","Growlithe","Arcanine","Poliwag","Poliwhirl","Poliwrath","Abra","Kadabra","Alakazam","Machop","Machoke","Machamp","Bellsprout","Weepinbell","Victreebel","Tentacool","Tentacruel","Geodude","Graveler","Golem","Ponyta","Rapidash","Slowpoke","Slowbro","Magnemite","Magneton","Farfetch'd","Doduo","Dodrio","Seel","Dewgong","Grimer","Muk","Shellder","Cloyster","Gastly","Haunter","Gengar","Onix","Drowzee","Hypno","Krabby","Kingler","Voltorb","Electrode","Exeggcute","Exeggutor","Cubone","Marowak","Hitmonlee","Hitmonchan","Lickitung","Koffing","Weezing","Rhyhorn","Rhydon","Chansey","Tangela","Kangaskhan","Horsea","Seadra","Goldeen","Seaking","Staryu","Starmie","Mr. Mime","Scyther","Jynx","Electabuzz","Magmar","Pinsir","Tauros","Magikarp","Gyarados","Lapras","Ditto","Eevee","Vaporeon","Jolteon","Flareon","Porygon","Omanyte","Omastar","Kabuto","Kabutops","Aerodactyl","Snorlax","Articuno","Zapdos","Moltres","Dratini","Dragonair","Dragonite","Mewtwo","Mew"];

const creatures = pokemonNames.map((name, i) => ({
  id: `poke${i + 1}`,
  name,
  img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i + 1}.png`,
  index: i + 1
}));

const LEGENDARIES = new Set([144, 145, 146, 150, 151]);
const RARES = new Set([25, 131, 142]);

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

const STORAGE_KEY = 'spelling_numbers_finn_v3';
let state = {
  difficulty: 1,
  streak: 0,
  mastered: [],
  mistakes: {},
  collection: [],
  stolen: [],
  lastQuestion: null,
  correctTotal: 0,
  sound: true,
  milestones: [],
  achievementsUnlocked: {},
  eggs: [],
  hatched: [],
  rocketWins: 0
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) state = JSON.parse(raw);
  } catch (e) {
    console.warn(e);
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

load();

// ========== HELPER FUNCTIONS ==========
function numToWords(n) {
  const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  
  if (n < 20) return ones[n];
  if (n < 100) {
    const t = Math.floor(n / 10), o = n % 10;
    return tens[t] + (o ? "-" + ones[o] : "");
  }
  if (n === 100) return 'one hundred';
  if (n < 200) {
    const r = n - 100;
    return 'one hundred' + (r ? ' ' + numToWords(r) : '');
  }
  if (n === 200) return 'two hundred';
  return String(n);
}

function speak(text) {
  if (!state.sound) return;
  if ('speechSynthesis' in window) {
    const u = new SpeechSynthesisUtterance(text);
    const v = speechSynthesis.getVoices().find(v => /female|zira|susan|kathy/i.test((v.name || '') + (v.lang || '') + (v.voiceURI || '')));
    if (v) u.voice = v;
    u.rate = 0.95;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  }
}

function playSound(type) {
  if (!state.sound) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    if (type === 'correct') {
      o.frequency.value = 880;
      o.type = 'sine';
      g.gain.value = 0.07;
    } else {
      o.frequency.value = 220;
      o.type = 'sawtooth';
      g.gain.value = 0.07;
    }
    o.start();
    o.stop(ctx.currentTime + 0.14);
  } catch (e) {}
}

function getRarity(index) {
  if (LEGENDARIES.has(index)) return 'legendary';
  if (RARES.has(index) || index > 120) return 'rare';
  return 'common';
}

function getCatchChance(index) {
  const r = getRarity(index);
  if (r === 'legendary') return 0.08;
  if (r === 'rare') return 0.28;
  return 0.65;
}

function unlockAchievement(key) {
  if (!state.achievementsUnlocked[key]) {
    state.achievementsUnlocked[key] = true;
    save();
    showTempMessage(`🏆 Achievement unlocked: ${achievements[key].name}`, 2200);
    renderAchievements();
  }
}

function showTempMessage(msg, ms = 1200, type = 'default') {
  const fb = document.getElementById('feedback');
  fb.textContent = msg;
  fb.className = `small center feedback-${type}`;
  setTimeout(() => {
    if (fb.textContent === msg) {
      fb.textContent = '';
      fb.className = 'small center';
    }
  }, ms);
}

// ========== UI REFS ==========
const qEl = document.getElementById('question');
const optEl = document.getElementById('options');
const inputRow = document.getElementById('inputRow');
const answerInput = document.getElementById('answerInput');
const encounterArea = document.getElementById('encounterArea');
const collectionBar = document.getElementById('collectionBar');
const difficultyLabel = document.getElementById('difficultyLabel');
const continueBtn = document.getElementById('continueBtn');
const eggsBar = document.getElementById('eggsBar');
const soundToggle = document.getElementById('soundToggle');

let gameTimerInterval = null;
let retryState = null;
let lastQuestionStart = 0;
let currentAnswer = null;
let selectedLetters = [];

// ========== GAME FLOW ==========
function updateDifficultyLabel() {
  difficultyLabel.textContent = 'Mixed Questions';
}

function startGame() {
  state.difficulty = 1;
  state.streak = 0;
  save();
  updateCollectionBar();
  renderEggs();
  renderAchievements();
  if (!gameTimerInterval) {
    gameTimerInterval = setInterval(checkEggs, 1000);
  }
  nextQuestion();
  showScreen('game');
}

function quitToMenu() {
  save();
  showScreen('menu');
}

function pickWeightedCreature() {
  const pool = [];
  creatures.forEach(c => {
    const r = getRarity(c.index);
    let w = (r === 'common' ? 10 : (r === 'rare' ? 4 : 1));
    if (state.correctTotal > 50 && r === 'rare') w += 3;
    if (state.correctTotal > 120 && r === 'legendary') w += 2;
    for (let i = 0; i < w; i++) pool.push(c);
  });
  return pool[Math.floor(Math.random() * pool.length)];
}

function chooseNumber() {
  const pool = [];
  for (let n of numbers) {
    const mastered = state.mastered.includes(n);
    const mistakes = state.mistakes[n] || 0;
    const m = mastered ? 1 : 3;
    const weight = Math.max(1, m + mistakes);
    for (let i = 0; i < weight; i++) pool.push(n);
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

function nextQuestion() {
  updateDifficultyLabel();
  document.getElementById('feedback').textContent = '';
  document.getElementById('feedback').className = 'small center';
  encounterArea.innerHTML = '';
  continueBtn.style.display = 'none';
  inputRow.style.display = 'none';
  optEl.innerHTML = '';
  answerInput.value = '';
  answerInput.placeholder = 'Type your answer';
  retryState = null;
  lastQuestionStart = Date.now();
  
  const n = chooseNumber();
  state.lastQuestion = n;
  const word = numToWords(n);
  
  // All question types randomly mixed
  const types = ['spellTiles', 'countForward', 'countBackward', 'skipCount', 
                 'placeValue', 'placeValueReverse', 'placeValueDifferent',
                 'nearestTen', 'compare', 'orderNumbers', 'findPattern'];
  const type = types[Math.floor(Math.random() * types.length)];

  if (type === 'spellTiles') showSpellTiles(n, word);
  else if (type === 'countForward') showCountForward(n);
  else if (type === 'countBackward') showCountBackward(n);
  else if (type === 'skipCount') showSkipCount();
  else if (type === 'placeValue') showPlaceValue(n);
  else if (type === 'placeValueReverse') showPlaceValueReverse(n);
  else if (type === 'placeValueDifferent') showPlaceValueDifferent(n);
  else if (type === 'nearestTen') showNearestTen(n);
  else if (type === 'compare') showCompare();
  else if (type === 'orderNumbers') showOrderNumbers();
  else if (type === 'findPattern') showFindPattern();
}

// ========== QUESTION RENDERERS ==========
function showSpellTiles(n, word) {
  currentAnswer = word;
  selectedLetters = [];
  qEl.textContent = `Spell the number: ${n}`;
  
  const letters = word.split('').filter(c => c !== ' ' && c !== '-');
  const shuffled = [...letters].sort(() => Math.random() - 0.5);
  
  optEl.innerHTML = '<div class="tile-display" id="tileDisplay"></div><div class="tile-bank" id="tileBank"></div>';
  const tileBank = document.getElementById('tileBank');
  
  shuffled.forEach((letter, i) => {
    const tile = document.createElement('button');
    tile.textContent = letter;
    tile.className = 'letter-tile';
    tile.style.setProperty('--i', i);
    tile.onclick = () => selectLetter(letter, tile);
    tileBank.appendChild(tile);
  });
  
  const clearBtn = document.createElement('button');
  clearBtn.textContent = '↺ Clear';
  clearBtn.className = 'secondary';
  clearBtn.onclick = clearLetters;
  tileBank.appendChild(clearBtn);
  
  const submitBtn = document.createElement('button');
  submitBtn.textContent = '✓ Check';
  submitBtn.onclick = checkSpelling;
  tileBank.appendChild(submitBtn);
  
  speak(`Spell the number ${n}`);
}

function selectLetter(letter, tile) {
  selectedLetters.push(letter);
  tile.disabled = true;
  tile.style.opacity = '0.3';
  updateTileDisplay();
}

function clearLetters() {
  selectedLetters = [];
  document.querySelectorAll('.letter-tile').forEach(tile => {
    tile.disabled = false;
    tile.style.opacity = '1';
  });
  updateTileDisplay();
}

function updateTileDisplay() {
  const display = document.getElementById('tileDisplay');
  if (!display) return;
  display.textContent = selectedLetters.join('') || '(click letters)';
}

function checkSpelling() {
  const answer = selectedLetters.join('');
  const correct = currentAnswer.replace(/[\s-]/g, '');
  if (answer === correct) return handleCorrect();
  else return handleWrong(currentAnswer);
}

function showCountForward(n) {
  if (n >= 199) n = Math.floor(Math.random() * 180) + 1;
  currentAnswer = String(n + 1);
  qEl.textContent = `What number comes after ${n}?`;
  speak(`What number comes after ${n}?`);
  inputRow.style.display = 'flex';
  answerInput.focus();
}

function showCountBackward(n) {
  if (n <= 2) n = Math.floor(Math.random() * 180) + 20;
  currentAnswer = String(n - 1);
  qEl.textContent = `What number comes before ${n}?`;
  speak(`What number comes before ${n}?`);
  inputRow.style.display = 'flex';
  answerInput.focus();
}

function showSkipCount() {
  const skip = [2, 5, 10, 20, 50][Math.floor(Math.random() * 5)];
  const start = Math.floor(Math.random() * (150 / skip)) * skip;
  const sequence = [];
  for (let i = 0; i < 5; i++) sequence.push(start + i * skip);
  const blankIndex = 2 + Math.floor(Math.random() * 2);
  currentAnswer = String(sequence[blankIndex]);
  sequence[blankIndex] = '___';
  
  qEl.textContent = `Skip count by ${skip}s. What is the missing number?`;
  optEl.innerHTML = `<div class="number-line">${sequence.join(' → ')}</div>`;
  speak(`Skip count by ${skip}s`);
  inputRow.style.display = 'flex';
  answerInput.focus();
}

function showPlaceValue(n) {
  currentAnswer = String(n);
  const h = Math.floor(n / 100);
  const t = Math.floor((n % 100) / 10);
  const o = n % 10;
  
  qEl.textContent = `What number is this?`;
  optEl.innerHTML = `<div class="place-value-display">${h} hundred${h !== 1 ? 's' : ''}, ${t} ten${t !== 1 ? 's' : ''}, ${o} one${o !== 1 ? 's' : ''}</div>`;
  speak(`${h} hundreds, ${t} tens, ${o} ones`);
  inputRow.style.display = 'flex';
  answerInput.focus();
}

function showPlaceValueReverse(n) {
  currentAnswer = `${Math.floor(n / 100)} ${Math.floor((n % 100) / 10)} ${n % 10}`;
  qEl.textContent = `Write ${n} using place value. Type: hundreds tens ones`;
  optEl.innerHTML = `<div class="small-muted">Example: 145 would be "1 4 5"</div>`;
  speak(`Write ${n} using place value`);
  inputRow.style.display = 'flex';
  answerInput.placeholder = 'hundreds tens ones';
  answerInput.focus();
}

function showPlaceValueDifferent(n) {
  if (n < 20) n = 20 + Math.floor(Math.random() * 180);
  const h = Math.floor(n / 100);
  const t = Math.floor((n % 100) / 10);
  const o = n % 10;
  
  const altT = h * 10 + t;
  currentAnswer = `${altT} ${o}`;
  
  qEl.textContent = `${n} = ${h} hundred, ${t} tens, ${o} ones. Write it using only tens and ones.`;
  optEl.innerHTML = `<div class="small-muted">Type: tens ones (Example: "17 2" for 17 tens and 2 ones)</div>`;
  speak(`Write ${n} using tens and ones`);
  inputRow.style.display = 'flex';
  answerInput.placeholder = 'tens ones';
  answerInput.focus();
}

function showNearestTen(n) {
  const mod = n % 10;
  if (mod === 0) n = n + Math.floor(Math.random() * 9) + 1;
  currentAnswer = String(mod < 5 ? n - mod : n + (10 - mod));
  
  qEl.textContent = `What is the nearest ten to ${n}?`;
  speak(`What is the nearest ten to ${n}?`);
  inputRow.style.display = 'flex';
  answerInput.focus();
}

function showCompare() {
  const n1 = Math.floor(Math.random() * 200) + 1;
  let n2 = Math.floor(Math.random() * 200) + 1;
  while (n2 === n1) n2 = Math.floor(Math.random() * 200) + 1;
  
  currentAnswer = n1 > n2 ? '>' : '<';
  
  qEl.textContent = `Which symbol goes between these numbers?`;
  optEl.innerHTML = `<div class="compare-display">${n1} ___ ${n2}</div>`;
  speak(`Compare ${n1} and ${n2}`);
  
  const symbols = ['>', '<'];
  symbols.forEach((sym, i) => {
    const btn = document.createElement('button');
    btn.textContent = sym;
    btn.className = 'symbol-btn';
    btn.style.setProperty('--i', i);
    btn.onclick = () => submitChoice(sym);
    optEl.appendChild(btn);
  });
}

function showOrderNumbers() {
  const nums = [];
  while (nums.length < 4) {
    const n = Math.floor(Math.random() * 200) + 1;
    if (!nums.includes(n)) nums.push(n);
  }
  
  const order = Math.random() > 0.5 ? 'least to greatest' : 'greatest to least';
  const sorted = order === 'least to greatest' ? [...nums].sort((a, b) => a - b) : [...nums].sort((a, b) => b - a);
  currentAnswer = sorted.join(' ');
  
  qEl.textContent = `Put these numbers in order from ${order}:`;
  optEl.innerHTML = `<div class="numbers-to-order">${nums.join(', ')}</div><div class="small-muted">Type the numbers in order, separated by spaces</div>`;
  speak(`Put these numbers in order from ${order}`);
  inputRow.style.display = 'flex';
  answerInput.placeholder = 'e.g. 5 10 15 20';
  answerInput.focus();
}

function showFindPattern() {
  const isIncreasing = Math.random() > 0.5;
  const step = [1, 2, 3, 5, 10][Math.floor(Math.random() * 5)];
  const start = Math.floor(Math.random() * 150) + 1;
  
  const sequence = [];
  for (let i = 0; i < 6; i++) {
    sequence.push(isIncreasing ? start + i * step : start - i * step);
  }
  
  const blankIndex = 2 + Math.floor(Math.random() * 3);
  currentAnswer = String(sequence[blankIndex]);
  const pattern = isIncreasing ? 'increasing' : 'decreasing';
  sequence[blankIndex] = '___';
  
  qEl.textContent = `Find the missing number in this ${pattern} pattern:`;
  optEl.innerHTML = `<div class="number-line">${sequence.join(', ')}</div>`;
  speak(`Find the missing number`);
  inputRow.style.display = 'flex';
  answerInput.focus();
}

// ========== SUBMISSION & RETRY LOGIC ==========
function submitChoice(selected) {
  if (String(selected) === String(currentAnswer)) return handleCorrect();
  else return handleWrong(String(currentAnswer));
}

function submitAnswer() {
  const valRaw = answerInput.value.trim();
  if (!valRaw) {
    showTempMessage('Please type an answer!', 1000, 'hint');
    return;
  }
  
  const val = valRaw.toLowerCase().replace(/\s+/g, ' ');
  const correct = String(currentAnswer).toLowerCase().replace(/\s+/g, ' ');
  
  if (retryState === 'force') {
    if (val === correct) return handleCorrect();
    else {
      showTempMessage(`Please type the correct answer.`, 1500, 'hint');
      return;
    }
  }
  
  if (val === correct) return handleCorrect();
  else return handleWrong(String(currentAnswer));
}

function handleCorrect() {
  const timeTaken = Date.now() - lastQuestionStart;
  if (timeTaken < 2000) unlockAchievement('speed_typist');
  
  state.streak++;
  state.correctTotal++;
  playSound('correct');
  
  if (state.streak >= 5 && state.difficulty < 3) {
    state.difficulty++;
    state.streak = 0;
  }
  
  if (!state.mastered.includes(state.lastQuestion)) {
    state.mastered.push(state.lastQuestion);
  }
  
  save();
  showTempMessage('Excellent!', 800, 'success');
  
  if (state.streak >= 10) {
    triggerEvolution();
    state.streak = 0;
  }
  
  if (state.correctTotal > 0 && state.correctTotal % 20 === 0) {
    triggerRocketBattle();
    return;
  }
  
  if (Math.random() < 0.08) giveEgg();
  
  maybeEncounter();
  
  if (!encounterArea.hasChildNodes()) {
    setTimeout(() => nextQuestion(), 700);
  }
}

function handleWrong(correct) {
  state.streak = 0;
  playSound('wrong');
  state.mistakes[state.lastQuestion] = (state.mistakes[state.lastQuestion] || 0) + 1;
  save();
  
  if (!retryState) {
    retryState = { hinted: true };
    showTempMessage(`Hint: it starts with "${String(correct)[0]}" — try again.`, 3000, 'hint');
    inputRow.style.display = 'flex';
  } else if (retryState && retryState.hinted) {
    retryState = 'force';
    showTempMessage(`Type the correct answer now to continue: ${correct}`, 5000, 'error');
    inputRow.style.display = 'flex';
  } else {
    retryState = 'force';
    showTempMessage(`Type the correct answer to continue: ${correct}`, 5000, 'error');
    inputRow.style.display = 'flex';
  }
}

// ========== ENCOUNTERS & CATCHING ==========
function maybeEncounter() {
  const chance = 0.30;
  if (Math.random() > chance) return;
  
  if (state.stolen.length > 0 && Math.random() < 0.35) {
    const stolenId = state.stolen[Math.floor(Math.random() * state.stolen.length)];
    const crit = creatures.find(c => c.id === stolenId);
    if (crit) return spawnEncounter(crit, true);
  }
  
  const crit = pickWeightedCreature();
  if (getRarity(crit.index) === 'legendary') {
    if (!state.milestones.includes('legendary-' + crit.index) && Math.random() > 0.12) return;
  }
  spawnEncounter(crit, false);
}

function spawnEncounter(crit, isStolen = false) {
  encounterArea.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'creature-popup';
  wrap.innerHTML = `<div class="center"><img src="${crit.img}" class="creature-img" alt="${crit.name}"></div>
    <div class="small center">${isStolen ? 'A stolen' : 'A wild'} <strong>${crit.name}</strong> appeared!</div>
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
  const timeout = setTimeout(() => {
    if (resolved) return;
    resolved = true;
    encounterArea.innerHTML = `<div class="small center">Oh no — ${crit.name} got away!</div>`;
    setTimeout(() => {
      encounterArea.innerHTML = '';
      nextQuestion();
    }, 900);
  }, 4500);

  btnCatch.onclick = () => {
    if (resolved) return;
    resolved = true;
    clearTimeout(timeout);
    const chance = getCatchChance(crit.index);
    const success = Math.random() < chance;
    
    if (success) {
      if (isStolen) {
        const idx = state.stolen.indexOf(crit.id);
        if (idx >= 0) state.stolen.splice(idx, 1);
        addToCollection(crit.id);
        encounterArea.innerHTML = `<div class="small center">🎉 You recaught <strong>${crit.name}</strong>!</div>`;
      } else {
        addToCollection(crit.id);
        encounterArea.innerHTML = `<div class="small center">🎉 You caught <strong>${crit.name}</strong>!</div>`;
        if (getRarity(crit.index) === 'legendary') {
          state.milestones.push('legendary-' + crit.index);
        }
      }
      save();
      setTimeout(() => {
        encounterArea.innerHTML = '';
        nextQuestion();
      }, 1000);
    } else {
      encounterArea.innerHTML = `<div class="small center">💨 Oh no — ${crit.name} escaped!</div>`;
      setTimeout(() => {
        encounterArea.innerHTML = '';
        nextQuestion();
      }, 900);
    }
  };

  btnRun.onclick = () => {
    if (resolved) return;
    resolved = true;
    clearTimeout(timeout);
    encounterArea.innerHTML = `<div class="small center">👋 You let ${crit.name} go.</div>`;
    setTimeout(() => {
      encounterArea.innerHTML = '';
      nextQuestion();
    }, 700);
  };
}

function addToCollection(id) {
  if (!state.collection.includes(id)) {
    state.collection.push(id);
    
    if (state.collection.length === 1) unlockAchievement('first_catch');
    if (state.collection.length >= 50) unlockAchievement('collector_50');
    
    const crit = creatures.find(c => c.id === id);
    if (crit && LEGENDARIES.has(crit.index)) {
      unlockAchievement('legendary_trainer');
    }
    
    if (state.collection.length === creatures.length) {
      unlockAchievement('dex_complete');
    }
    
    save();
    updateCollectionBar();
  } else {
    showTempMessage('You already have that one!', 900, 'hint');
  }
}

function updateCollectionBar() {
  state.collection.forEach(cid => {
    const c = creatures.find(x => x.id === cid);
    if (!c) return;
    const el = document.createElement('div');
    el.className = 'collection-creature';
    el.title = c.name;
    el.innerHTML = `<img src="${c.img}" alt="${c.name}"><div class="small-muted">${c.name}</div>`;
    collectionBar.appendChild(el);
  });
}

// ========== EGGS & HATCHING ==========
function giveEgg() {
  const minutes = 2 + Math.floor(Math.random() * 4);
  const hatchTime = Date.now() + minutes * 60 * 1000;
  const egg = { id: `egg${Date.now()}`, hatchTime, critId: pickWeightedCreature().id };
  state.eggs.push(egg);
  save();
  showTempMessage('An egg has been added to your collection! 🥚', 2000, 'hint');
  if (state.eggs.length >= 10) unlockAchievement('egg_collector');
  renderEggs();
}

function renderEggs() {
  eggsBar.innerHTML = '';
  state.eggs.forEach(egg => {
    const eggEl = document.createElement('div');
    eggEl.className = 'egg';
    const secondsLeft = Math.floor((egg.hatchTime - Date.now()) / 1000);
    const minutesLeft = Math.ceil(secondsLeft / 60);
    eggEl.innerHTML = `🐣<div class="egg-timer">${minutesLeft} min</div>`;
    eggsBar.appendChild(eggEl);
  });
}

function checkEggs() {
  const now = Date.now();
  const hatchedEggs = state.eggs.filter(e => now >= e.hatchTime);
  const remainingEggs = state.eggs.filter(e => now < e.hatchTime);
  state.eggs = remainingEggs;

  hatchedEggs.forEach(egg => {
    state.hatched.push(egg.critId);
    addToCollection(egg.critId);
    const crit = creatures.find(c => c.id === egg.critId);
    if (crit) {
      showTempMessage(`🎉 Your egg hatched a ${crit.name}!`, 3000, 'success');
      unlockAchievement('egg_hatcher');
    }
  });

  if (hatchedEggs.length > 0) {
    save();
    renderEggs();
    updateCollectionBar();
  }
}

// ========== EVOLUTION & TEAM ROCKET ==========
function triggerEvolution() {
  const potentialEvo = state.collection.find(cid => {
    const crit = creatures.find(c => c.id === cid);
    if (crit && crit.index < 100 && (crit.index % 10 === 0)) return true;
    return false;
  });
  
  if (potentialEvo) {
    const crit = creatures.find(c => c.id === potentialEvo);
    const nextCrit = creatures.find(c => c.index === crit.index + 1);
    if (nextCrit) {
      state.collection = state.collection.filter(id => id !== crit.id);
      addToCollection(nextCrit.id);
      showTempMessage(`✨ ${crit.name} evolved into ${nextCrit.name}!`, 2500, 'success');
    }
  }
}

let rocketBattleCorrect = 0;
let rocketBattleQuestion = null;

function triggerRocketBattle() {
  showScreen('rocketBattle');
  const rocketWords = ['one hundred', 'one hundred fifty', 'two hundred'];
  const rocketWord = rocketWords[Math.floor(Math.random() * rocketWords.length)];
  rocketBattleQuestion = rocketWord;
  document.getElementById('rocketQuestion').textContent = `Spell this to defeat Team Rocket: ${rocketWord.replace(/\w/g, '_ ')}`;
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
  btn.onclick = () => {
    const val = input.value.trim().toLowerCase();
    if (val === rocketBattleQuestion) {
      rocketBattleCorrect++;
      document.getElementById('rocketFeedback').textContent = 'Correct!';
      if (rocketBattleCorrect >= 3) {
        handleRocketVictory();
      } else {
        document.getElementById('rocketQuestion').textContent = `Spell it again! (${3 - rocketBattleCorrect} more to go)`;
        input.value = '';
      }
    } else {
      document.getElementById('rocketFeedback').textContent = `Incorrect! Get it right to continue.`;
    }
  };
  
  rocketOptions.appendChild(input);
  rocketOptions.appendChild(btn);
}

function handleRocketVictory() {
  state.rocketWins++;
  if (state.rocketWins >= 5) unlockAchievement('rocket_defeated');
  showTempMessage(`You defeated Team Rocket!`, 3000, 'success');
  
  if (state.collection.length > 0) {
    const stolenCreature = state.collection[Math.floor(Math.random() * state.collection.length)];
    state.stolen.push(stolenCreature);
    state.collection = state.collection.filter(c => c !== stolenCreature);
    const crit = creatures.find(c => c.id === stolenCreature);
    showTempMessage(`But they stole your ${crit.name}!`, 3000, 'error');
  }
  
  setTimeout(() => {
    showScreen('game');
    updateCollectionBar();
    nextQuestion();
  }, 1500);
}

// ========== SCREENS & NAVIGATION ==========
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(el => el.style.display = 'none');
  document.getElementById(id).style.display = 'block';
  
  if (id === 'game') {
    updateCollectionBar();
    renderEggs();
    renderAchievements();
    updateDifficultyLabel();
  }
  if (id === 'map') renderMap();
  if (id === 'dex') renderDex();
  if (id === 'analytics') renderAnalytics();
}

// ========== ANALYTICS & SETTINGS ==========
function renderMap() {
  const mapGrid = document.getElementById('mapGrid');
  mapGrid.innerHTML = '';
  for (let i = 1; i <= MAX_NUM; i++) {
    const tile = document.createElement('div');
    tile.className = 'map-tile';
    tile.textContent = i;
    if (state.mastered.includes(i)) tile.classList.add('completed');
    mapGrid.appendChild(tile);
  }
}

function renderDex() {
  const dexGrid = document.getElementById('dexGrid');
  dexGrid.innerHTML = '';
  creatures.forEach(c => {
    const el = document.createElement('div');
    el.className = 'dex-creature';
    const isCaught = state.collection.includes(c.id);
    if (!isCaught) el.classList.add('locked');
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

function renderAnalytics() {
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
  const sortedMistakes = Object.entries(state.mistakes).sort(([, a], [, b]) => b - a);
  if (sortedMistakes.length === 0) {
    mistakesList.innerHTML = '<li>No mistakes yet!</li>';
  } else {
    sortedMistakes.slice(0, 5).forEach(([num, count]) => {
      const li = document.createElement('li');
      li.textContent = `${num}: ${count} mistakes`;
      mistakesList.appendChild(li);
    });
  }
  
  soundToggle.checked = state.sound;
}

function renderAchievements() {
  const list = document.getElementById('achievementsList');
  list.innerHTML = '';
  const unlocked = Object.keys(state.achievementsUnlocked).length;
  if (unlocked === 0) {
    list.textContent = 'No achievements unlocked yet.';
    return;
  }
  Object.keys(achievements).forEach(key => {
    if (state.achievementsUnlocked[key]) {
      const span = document.createElement('span');
      span.textContent = `🏆 ${achievements[key].name}`;
      span.style.margin = '0 5px';
      list.appendChild(span);
    }
  });
}

function resetGame() {
  if (confirm("Are you sure you want to reset all your progress?")) {
    localStorage.removeItem(STORAGE_KEY);
    state = {
      difficulty: 1,
      streak: 0,
      mastered: [],
      mistakes: {},
      collection: [],
      stolen: [],
      lastQuestion: null,
      correctTotal: 0,
      sound: true,
      milestones: [],
      achievementsUnlocked: {},
      eggs: [],
      hatched: [],
      rocketWins: 0
    };
    save();
    showTempMessage('Progress has been reset!', 2000, 'error');
    showScreen('menu');
  }
}

// ========== EVENT LISTENERS ==========
window.onload = function() {
  showScreen('menu');
  
  soundToggle.checked = state.sound;
  soundToggle.addEventListener('change', (e) => {
    state.sound = e.target.checked;
    save();
  });
  
  document.getElementById('playBtn').onclick = startGame;
  document.getElementById('mapBtn').onclick = () => showScreen('map');
  document.getElementById('dexBtn').onclick = () => showScreen('dex');
  document.getElementById('analyticsBtn').onclick = () => showScreen('analytics');
  document.getElementById('backFromMap').onclick = () => showScreen('menu');
  document.getElementById('backFromDex').onclick = () => showScreen('menu');
  document.getElementById('backFromAnalytics').onclick = () => showScreen('menu');
  document.getElementById('quitBtn').onclick = quitToMenu;
  document.getElementById('resetBtn').onclick = resetGame;
  document.getElementById('submitBtn').onclick = submitAnswer;
  document.getElementById('answerInput').onkeydown = (e) => {
    if (e.key === 'Enter') submitAnswer();
  };
  document.getElementById('continueBtn').onclick = nextQuestion;
  document.getElementById('forfeitRocket').onclick = () => {
    showTempMessage('You gave up! Next time!', 2000, 'error');
    setTimeout(() => showScreen('game'), 500);
  };
  
  updateCollectionBar();
  renderAchievements();
  renderEggs();
  
  gameTimerInterval = setInterval(checkEggs, 1000);
};
