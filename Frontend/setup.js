/* Stay Close — setup.js (Multi-step setup flow) */

/* ============================================================
   VOICE RECORDING DATA
   ============================================================ */

const VOICE_SETS = [
  [
    "The sun is shining and the weather is beautiful today.",
    "I love spending time with my family during the holidays.",
    "Please pass the salt, and thank you very much.",
    "I'll call you back as soon as I get home this evening.",
    "Good morning! I hope you slept well last night."
  ],
  [
    "I'm so proud of everything you've accomplished.",
    "Let's plan something special for next weekend together.",
    "Can you believe how fast the time has gone by?",
    "I was just thinking about you and wanted to check in.",
    "Make sure you're eating well and getting enough rest."
  ],
  [
    "I'll always be here whenever you need anything at all.",
    "Remember when we used to do that every summer?",
    "How about we have dinner together this Friday evening?",
    "You've been on my mind so much lately. I miss you.",
    "I sent you a little something in the mail this week."
  ],
  [
    "Thank you for always being so thoughtful and kind.",
    "I'm going to come visit you really soon, I promise.",
    "Don't worry about a thing — I've got it all taken care of.",
    "I love you so much and I'm so glad you're in my life.",
    "Goodnight, sweet dreams, and I'll talk to you tomorrow."
  ]
];

/* ============================================================
   STATE
   ============================================================ */

let currentStep   = 1;
let currentSet    = 1;
let currentSentence = 0;
let isRecording   = false;
let recordingTimer = null;
let sentencesDone = [false, false, false, false, false];
let setsDone      = [false, false, false, false];
let inviteSentAt  = null;
let timestampTimer = null;

/* ============================================================
   STEP NAVIGATION
   ============================================================ */

function goToStep(n) {
  document.getElementById(`step-${currentStep}`).classList.remove('active');
  currentStep = n;
  document.getElementById(`step-${n}`).classList.add('active');
  window.scrollTo(0, 0);
  updateStepNav();

  if (n === 2) initVoiceStep();
  if (n === 5) startWaitingTimestamp();
}

function updateStepNav() {
  document.querySelectorAll('.step-dot').forEach(dot => {
    const s = parseInt(dot.dataset.step);
    dot.classList.remove('active', 'done');
    if (s === currentStep) dot.classList.add('active');
    if (s < currentStep) dot.classList.add('done');
  });

  document.querySelectorAll('.step-line').forEach((line, i) => {
    line.classList.toggle('done', i + 1 < currentStep);
  });
}

/* ============================================================
   STEP 1 — RELATIONSHIP SETUP
   ============================================================ */

document.querySelectorAll('.rel-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.rel-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  });
});

function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    const preview = document.getElementById('photo-preview');
    preview.innerHTML = `<img src="${e.target.result}" alt="Your photo">`;
  };
  reader.readAsDataURL(file);
}

/* ============================================================
   STEP 2 — VOICE RECORDING
   ============================================================ */

function initVoiceStep() {
  currentSentence = 0;
  sentencesDone = [false, false, false, false, false];
  renderSentenceList();
  updateSentenceCard();
  updateSetProgress();
  updateSaveSetBtn();
  document.getElementById('playback-btn').classList.add('hidden');
  resetRecordBtn();
}

function renderSentenceList() {
  const list = document.getElementById('sentence-list');
  const sentences = VOICE_SETS[currentSet - 1];
  list.innerHTML = '';
  sentences.forEach((text, i) => {
    const div = document.createElement('div');
    div.className = 'sentence-item' + (sentencesDone[i] ? ' done' : '') + (i === currentSentence ? ' current' : '');
    div.innerHTML = `
      <div class="sentence-check">${sentencesDone[i] ? '✓' : ''}</div>
      <span>${text}</span>
    `;
    list.appendChild(div);
  });
}

function updateSentenceCard() {
  const sentences = VOICE_SETS[currentSet - 1];
  document.getElementById('sentence-text').textContent = sentences[currentSentence];
  document.getElementById('sentence-counter').textContent = `Sentence ${currentSentence + 1} of 5`;
}

function updateSetProgress() {
  document.getElementById('current-set-label').textContent = `Set ${currentSet} of 4`;

  document.querySelectorAll('.set-dot').forEach((dot, i) => {
    dot.classList.remove('active', 'done');
    if (i + 1 === currentSet) dot.classList.add('active');
    if (setsDone[i]) dot.classList.add('done');
  });
}

function updateSaveSetBtn() {
  const allDone = sentencesDone.every(Boolean);
  document.getElementById('save-set-btn').disabled = !allDone;
}

function resetRecordBtn() {
  const btn = document.getElementById('record-btn');
  const label = document.getElementById('record-label');
  btn.classList.remove('recording');
  label.textContent = 'Tap to record';
  isRecording = false;
  clearTimeout(recordingTimer);
}

function toggleRecording() {
  if (isRecording) {
    stopRecording();
  } else {
    startRecording();
  }
}

function startRecording() {
  isRecording = true;
  const btn = document.getElementById('record-btn');
  const label = document.getElementById('record-label');
  btn.classList.add('recording');
  label.textContent = 'Recording…';
  simulateNoise('recording');

  // Simulate auto-complete after 3 seconds (UI demo)
  recordingTimer = setTimeout(() => {
    stopRecording();
    markSentenceDone();
  }, 3000);
}

function stopRecording() {
  isRecording = false;
  const btn = document.getElementById('record-btn');
  const label = document.getElementById('record-label');
  btn.classList.remove('recording');
  label.textContent = 'Tap to record';
  simulateNoise('idle');
  clearTimeout(recordingTimer);
  document.getElementById('playback-btn').classList.remove('hidden');
}

function markSentenceDone() {
  sentencesDone[currentSentence] = true;
  document.getElementById('playback-btn').classList.remove('hidden');

  if (currentSentence < 4) {
    setTimeout(() => {
      currentSentence++;
      renderSentenceList();
      updateSentenceCard();
      document.getElementById('playback-btn').classList.add('hidden');
      resetRecordBtn();
      updateSaveSetBtn();
    }, 600);
  } else {
    renderSentenceList();
    updateSaveSetBtn();
  }
}

function playback() {
  // TODO: play back the recorded audio
  const btn = document.getElementById('playback-btn');
  btn.textContent = '▶ Playing…';
  setTimeout(() => { btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><polygon points="5,3 19,12 5,21 5,3"/></svg> Play back'; }, 2000);
}

function saveVoiceSet() {
  setsDone[currentSet - 1] = true;

  if (currentSet < 4) {
    currentSet++;
    initVoiceStep();
    updateSetProgress();
  } else {
    // All 4 sets done — move on
    goToStep(3);
  }
}

function saveLater(event) {
  event.preventDefault();
  // TODO: save progress to Firebase, show confirmation
  const link = event.target;
  link.textContent = 'Progress saved ✓';
  link.style.color = 'var(--green)';
  setTimeout(() => {
    link.textContent = 'Come back later';
    link.style.color = '';
  }, 2000);
}

function simulateNoise(mode) {
  const fill = document.getElementById('noise-fill');
  const status = document.getElementById('noise-status');

  if (mode === 'recording') {
    fill.style.width = '28%';
    fill.className = 'noise-fill';
    status.textContent = 'Good';
    status.style.color = 'var(--green)';
  } else {
    fill.style.width = '18%';
    fill.className = 'noise-fill';
    status.textContent = 'Good';
    status.style.color = 'var(--green)';
  }
}

/* ============================================================
   STEP 3 — MEMORY CARD
   ============================================================ */

document.querySelectorAll('.topic-tag').forEach(tag => {
  tag.addEventListener('click', () => tag.classList.toggle('selected'));
});

function addFreeTag(event, type) {
  if (event.key !== 'Enter') return;
  event.preventDefault();
  const input = event.target;
  const value = input.value.trim();
  if (!value) return;

  const newTag = document.createElement('button');
  newTag.className = 'topic-tag selected';
  newTag.textContent = value;
  newTag.addEventListener('click', () => newTag.classList.toggle('selected'));

  const container = document.getElementById('topic-tags');
  container.appendChild(newTag);
  input.value = '';
}

function addNameTag(event) {
  if (event.key !== 'Enter') return;
  event.preventDefault();
  const input = event.target;
  const value = input.value.trim();
  if (!value) return;

  const tag = document.createElement('div');
  tag.className = 'name-tag';
  tag.innerHTML = `${escapeHtml(value)}<button onclick="this.parentElement.remove()" aria-label="Remove ${escapeHtml(value)}">×</button>`;

  const container = document.getElementById('name-tags');
  container.appendChild(tag);
  input.value = '';
}

function addAppointment() {
  const list = document.getElementById('appointments-list');
  const item = document.createElement('div');
  item.className = 'list-item';
  item.innerHTML = `
    <input type="date" class="list-item-date" placeholder="Date">
    <input type="text" placeholder="e.g. Doctor's appointment, Dentist…">
    <button class="list-item-remove" onclick="this.parentElement.remove()" aria-label="Remove">×</button>
  `;
  list.appendChild(item);
  item.querySelector('input[type="text"]').focus();
}

function addMedication() {
  const list = document.getElementById('medications-list');
  const item = document.createElement('div');
  item.className = 'list-item';
  item.innerHTML = `
    <input type="text" placeholder="e.g. Lisinopril 10mg every morning">
    <button class="list-item-remove" onclick="this.parentElement.remove()" aria-label="Remove">×</button>
  `;
  list.appendChild(item);
  item.querySelector('input').focus();
}

/* ============================================================
   STEP 4 — INVITE
   ============================================================ */

function updateInvitePreview() {
  const name = document.getElementById('grandma-name').value.trim() || 'Dorothy';
  const yourName = document.getElementById('your-name').value.trim() || 'Sarah';
  const msg = document.getElementById('invite-message');
  msg.value = `Hi ${name}, it's ${yourName} — I set up a special way for us to stay in touch every day. Tap here to get started 💛 [link]`;
}

function sendInvite() {
  const phone = document.getElementById('grandma-phone').value.trim();
  if (!phone) {
    document.getElementById('grandma-phone').focus();
    return;
  }

  inviteSentAt = Date.now();

  const btn = document.querySelector('#step-4 .btn-primary');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  // TODO: call handleConsent Firebase Function
  setTimeout(() => {
    const name = document.getElementById('grandma-name').value.trim() || 'Dorothy';
    document.getElementById('waiting-initials').textContent = (document.getElementById('your-name').value.trim() || 'S').charAt(0).toUpperCase();
    document.getElementById('celebrate-text').textContent = `${name} accepted! Let's set up her daily call.`;
    goToStep(5);
    btn.textContent = 'Send Invite →';
    btn.disabled = false;
  }, 1000);
}

/* ============================================================
   STEP 5 — WAITING ROOM
   ============================================================ */

function startWaitingTimestamp() {
  inviteSentAt = inviteSentAt || Date.now();
  clearInterval(timestampTimer);
  updateTimestamp();
  timestampTimer = setInterval(updateTimestamp, 30000);
}

function updateTimestamp() {
  if (!inviteSentAt) return;
  const minutes = Math.round((Date.now() - inviteSentAt) / 60000);
  const el = document.getElementById('waiting-timestamp');
  if (minutes < 1) el.textContent = 'Invite sent just now';
  else if (minutes === 1) el.textContent = 'Invite sent 1 minute ago';
  else el.textContent = `Invite sent ${minutes} minutes ago`;
}

function resendInvite() {
  inviteSentAt = Date.now();
  updateTimestamp();
  const btn = document.querySelector('.waiting-actions .btn-outline');
  btn.textContent = '✓ Resent!';
  setTimeout(() => { btn.textContent = 'Resend Invite'; }, 2000);
}

function callGrandmaPhone() {
  const phone = document.getElementById('grandma-phone').value.replace(/\D/g, '');
  if (phone) window.location.href = `tel:+1${phone}`;
}

function simulateAccept() {
  clearInterval(timestampTimer);
  goToStep(6);
}

/* ============================================================
   STEP 6 — SCHEDULE
   ============================================================ */

function setFrequency(mode) {
  document.getElementById('freq-everyday').classList.toggle('active', mode === 'everyday');
  document.getElementById('freq-custom').classList.toggle('active', mode === 'custom');
  document.getElementById('day-selector').classList.toggle('hidden', mode === 'everyday');
}

document.querySelectorAll('.day-btn').forEach(btn => {
  btn.addEventListener('click', () => btn.classList.toggle('active'));
});

function startSchedule() {
  const time = document.getElementById('call-time').value;
  const timezone = document.getElementById('call-timezone').value;
  const isEveryday = document.getElementById('freq-everyday').classList.contains('active');
  const days = isEveryday ? ['mon','tue','wed','thu','fri','sat','sun'] :
    [...document.querySelectorAll('.day-btn.active')].map(b => b.dataset.day);

  const btn = document.querySelector('#step-6 .btn-primary');
  btn.textContent = 'Starting…';
  btn.disabled = true;

  // TODO: save schedule to Firestore, activate scheduleCall function
  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 800);
}

/* ============================================================
   UTILITIES
   ============================================================ */

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Auto-detect timezone
(function detectTimezone() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const sel = document.getElementById('call-timezone');
    if (sel) {
      for (let opt of sel.options) {
        if (opt.value === tz) { opt.selected = true; break; }
      }
    }
  } catch (_) {}
})();

// Initialize on load
updateStepNav();
