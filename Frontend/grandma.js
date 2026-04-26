/* Stay Close — grandma.js (Dorothy's home screen PWA) */

/* ============================================================
   STATE
   ============================================================ */

let isListening      = false;
let micTimer         = null;
let currentQuestion  = '';
let sarahName        = 'Sarah';
let dorothyName      = 'Dorothy';
let callTime         = '9:00 AM';

/* ============================================================
   INIT — load Sarah's info from userId param
   ============================================================ */

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function init() {
  const userId = getParam('userId');

  if (!userId) {
    showView('view-missing');
    return;
  }

  // TODO: load from Firestore using userId
  // For now, use URL params for demo
  sarahName   = getParam('name')     || 'Sarah';
  dorothyName = getParam('for')      || 'Dorothy';
  const relation = getParam('rel')   || 'Your Daughter';
  callTime        = getParam('time') || '9:00 AM';
  const photoURL  = getParam('photo') || null;

  // Populate all views with Sarah's info
  populateSarahInfo(sarahName, relation, photoURL);

  // Time-of-day greeting
  updateGreeting();
}

function populateSarahInfo(name, relation, photoURL) {
  // Home screen
  document.getElementById('sarah-name-display').textContent   = name;
  document.getElementById('sarah-relation-display').textContent = relation;
  document.getElementById('call-reminder').textContent         = `${name} calls you every morning at ${callTime}`;
  document.getElementById('greeting').textContent              = `${getGreeting()}, ${dorothyName}`;

  // Ask screen
  document.getElementById('ask-prompt').textContent = `What would you like to know, ${dorothyName}?`;

  // Answer screen
  document.getElementById('answer-from-name').textContent = `${name} says:`;

  // Call screen
  document.getElementById('call-name').textContent = name;

  // Photo initials everywhere
  const initial = name.charAt(0).toUpperCase();
  ['home-initial', 'call-initial', 'answer-initial'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = initial;
  });

  // If a photo URL was provided, set it in all photo slots
  if (photoURL) {
    const slots = ['home-photo', 'call-photo', 'answer-sarah-thumb'];
    slots.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = `<img src="${photoURL}" alt="${name}">`;
    });
  }
}

/* ============================================================
   GREETING (time-of-day)
   ============================================================ */

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function updateGreeting() {
  document.getElementById('greeting').textContent = `${getGreeting()}, ${dorothyName}`;
}

/* ============================================================
   VIEW SYSTEM
   ============================================================ */

function showView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(viewId).classList.add('active');

  // Reset mic state when leaving ask view
  if (viewId !== 'view-ask') {
    stopListening();
  }

  // Start call animation when entering call view
  if (viewId === 'view-call') {
    startCall();
  }
}

/* ============================================================
   CALL FLOW
   ============================================================ */

function startCall() {
  document.querySelector('.call-status-text').textContent = 'Calling…';
  // Simulate connected after 2s
  setTimeout(() => {
    document.querySelector('.call-status-text').textContent = 'Connected';
  }, 2000);
  // TODO: initiate Twilio call via Firebase Function
}

function endCall() {
  // TODO: hang up Twilio call
  showView('view-home');
}

/* ============================================================
   MIC INPUT
   ============================================================ */

function toggleMic() {
  if (isListening) {
    stopListening();
  } else {
    startListening();
  }
}

function startListening() {
  isListening = true;
  const btn = document.getElementById('mic-btn');
  const instr = document.getElementById('mic-instruction');
  const wave = document.getElementById('mic-wave');

  btn.classList.add('listening');
  instr.textContent = 'Listening…';
  wave.classList.remove('hidden');

  // TODO: use Web Speech API or Twilio for real speech capture
  // Simulate auto-stop after 4 seconds
  micTimer = setTimeout(() => {
    stopListening();
    submitQuestion("What's the weather like today?"); // Demo question
  }, 4000);
}

function stopListening() {
  isListening = false;
  clearTimeout(micTimer);

  const btn   = document.getElementById('mic-btn');
  const instr = document.getElementById('mic-instruction');
  const wave  = document.getElementById('mic-wave');

  if (btn)   btn.classList.remove('listening');
  if (instr) instr.textContent = 'Tap and speak your question';
  if (wave)  wave.classList.add('hidden');
}

function submitTextQuestion() {
  const input = document.getElementById('type-question');
  const text = input.value.trim();
  if (!text) { input.focus(); return; }
  submitQuestion(text);
  input.value = '';
}

function submitQuestion(question) {
  currentQuestion = question;
  showView('view-answer');

  document.getElementById('answer-text').textContent = 'Just a moment…';
  document.getElementById('answer-playing-status').textContent = '⏳ Thinking…';

  // TODO: call getAIResponse Firebase Function with question + memory card
  // Then call synthesizeVoice and auto-play audio
  setTimeout(() => {
    const mockAnswer = getMockAnswer(question);
    document.getElementById('answer-text').textContent = mockAnswer;
    document.getElementById('answer-playing-status').textContent = '🔊 Playing Sarah\'s voice…';

    // Simulate audio finishing
    setTimeout(() => {
      document.getElementById('answer-playing-status').textContent = '✓ Done';
    }, 4000);
  }, 1500);
}

function getMockAnswer(question) {
  const q = question.toLowerCase();
  if (q.includes('weather'))  return "It looks like a lovely day today — partly cloudy and around 68 degrees. Perfect for a little time in the garden!";
  if (q.includes('medication') || q.includes('pill') || q.includes('medicine')) return "You take Lisinopril 10mg and Metformin 500mg with your breakfast each morning. Don't forget!";
  if (q.includes('appointment') || q.includes('doctor')) return "You have your cardiologist checkup with Dr. Rivera on April 28th. That's coming up soon!";
  if (q.includes('betty'))    return "Betty is your dear friend from church. She's coming to visit you on Friday — how lovely!";
  return "That's a great question! I'd love to help with that. Give me just a moment to think… You know I always want to make sure I'm giving you the right answer.";
}

/* ============================================================
   ERROR STATE
   ============================================================ */

function alertSarah() {
  // TODO: call Firebase Function to send SMS alert to Sarah
  const btn = document.querySelector('.btn-alert-sarah');
  btn.textContent = 'Sarah has been notified ✓';
  btn.style.background = '#2D8A5E';
  btn.disabled = true;
}

/* ============================================================
   INIT
   ============================================================ */

// Update greeting every minute in case of hour change
setInterval(updateGreeting, 60000);

init();
