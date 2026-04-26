/* Stay Close — dashboard.js */

/* ============================================================
   MOCK DATA
   ============================================================ */

const MOCK_CALLS = [
  {
    id: 'call-001',
    date: 'Today · Apr 25, 2026',
    time: '9:03 AM',
    duration: '4m 12s',
    alertLevel: 'urgent',
    statusIcon: '🔴',
    summaryPreview: 'Dorothy mentioned she fell getting up this morning.',
    summary: "Dorothy seemed a little off today. She mentioned she fell getting up from bed this morning but said she wasn’t hurt badly. She talked about Betty coming to visit on Friday. She asked about the grandchildren.",
    transcript: [
      { speaker: 'sarah',   text: "Good morning Dorothy, it’s me Sarah! How are you feeling today?" },
      { speaker: 'dorothy', text: "Oh Sarah, I wasn’t feeling too well this morning. I fell getting up but I caught myself on the dresser." },
      { speaker: 'sarah',   text: "Oh no, I’m glad you’re okay. Are you sure you’re not hurt?" },
      { speaker: 'dorothy', text: "I’m alright, just a little sore. Betty is coming to visit on Friday though, so that’s something to look forward to." },
      { speaker: 'sarah',   text: "That’s wonderful! I’m so glad Betty will be there. I’ll try to call you tonight too." },
      { speaker: 'dorothy', text: 'That would be lovely dear. How are the grandchildren?' }
    ]
  },
  {
    id: 'call-002',
    date: 'Yesterday · Apr 24, 2026',
    time: '9:02 AM',
    duration: '6m 38s',
    alertLevel: null,
    statusIcon: '✅',
    summaryPreview: 'Lovely conversation about the garden and upcoming spring planting.',
    summary: "A warm, cheerful call. Dorothy is excited about her tomato plants and mentioned she bought new seeds at the church fundraiser. She asked about Sarah’s work and seemed in very good spirits.",
    transcript: [
      { speaker: 'sarah',   text: 'Good morning! You sound cheerful today!' },
      { speaker: 'dorothy', text: 'Oh I am! I was out in the garden this morning. My tomatoes are just coming up beautifully.' },
      { speaker: 'sarah',   text: "Oh that’s so exciting! You always have the best tomatoes." },
      { speaker: 'dorothy', text: 'I got some new seeds at the church fundraiser on Sunday. Pastor Jim was asking about you.' }
    ]
  },
  {
    id: 'call-003',
    date: 'Apr 23, 2026',
    time: '9:05 AM',
    duration: '5m 04s',
    alertLevel: null,
    statusIcon: '✅',
    summaryPreview: 'Dorothy mentioned she watched her favorite TV show last night.',
    summary: 'Dorothy watched her favorite show and wanted to chat about the plot. She mentioned taking her medication with breakfast as usual. All clear.',
    transcript: [
      { speaker: 'sarah',   text: 'Good morning! How did you sleep?' },
      { speaker: 'dorothy', text: 'Wonderfully! I watched my show last night and then fell right asleep.' }
    ]
  },
  {
    id: 'call-004',
    date: 'Apr 22, 2026',
    time: '9:01 AM',
    duration: '1m 48s',
    alertLevel: 'routine',
    statusIcon: '🟡',
    summaryPreview: "Shorter than usual — Dorothy said she was tired.",
    summary: "Brief call. Dorothy said she hadn’t slept well and wanted to rest. Nothing alarming, just a short morning.",
    transcript: [
      { speaker: 'sarah',   text: 'Good morning, how are you today?' },
      { speaker: 'dorothy', text: "I didn’t sleep well dear, I think I need to rest a little more." },
      { speaker: 'sarah',   text: "Of course, get some rest. I’ll talk to you tomorrow. Love you!" },
      { speaker: 'dorothy', text: 'Love you too, sweetheart.' }
    ]
  },
  {
    id: 'call-005',
    date: 'Apr 21, 2026',
    time: '9:03 AM',
    duration: '7m 15s',
    alertLevel: null,
    statusIcon: '✅',
    summaryPreview: "Dorothy talked about Cousin Earl’s visit and her new book.",
    summary: "Great conversation. Dorothy is reading a new novel from the library — a mystery, she says. Cousin Earl visited on Sunday, which she loved.",
    transcript: []
  }
];

/* ============================================================
   PANEL NAVIGATION
   ============================================================ */

function showPanel(panelId, navEl) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById(panelId).classList.add('active');
  if (navEl) navEl.classList.add('active');
}

/* ============================================================
   DASHBOARD PANEL — render call cards
   ============================================================ */

function renderCallCards() {
  const container = document.getElementById('call-cards');
  container.innerHTML = '';

  MOCK_CALLS.slice(0, 5).forEach(call => {
    const card = document.createElement('div');
    card.className = 'call-card';
    card.innerHTML = `
      <div class="call-card-header" onclick="toggleCallCard('${call.id}')">
        <span class="call-status-icon">${call.statusIcon}</span>
        <div class="call-meta">
          <p class="call-date">${call.date} · ${call.time}</p>
          <p class="call-duration">${call.duration}</p>
        </div>
        <p class="call-summary-preview">${call.summaryPreview}</p>
        <button class="call-expand-btn" id="expand-${call.id}">Expand ↓</button>
      </div>
      <div class="call-card-body" id="body-${call.id}">
        <p>${call.summary}</p>
        <a href="#" class="view-transcript-link" onclick="openTranscript('${call.id}')">Read full transcript →</a>
      </div>
    `;
    container.appendChild(card);
  });
}

function toggleCallCard(callId) {
  const body = document.getElementById(`body-${callId}`);
  const btn  = document.getElementById(`expand-${callId}`);
  const open = body.classList.toggle('open');
  btn.textContent = open ? 'Collapse ↑' : 'Expand ↓';
}

/* ============================================================
   CALL LOG PANEL
   ============================================================ */

let currentFilter = 'all';

function renderCallLog() {
  const container = document.getElementById('call-log-list');
  container.innerHTML = '';

  const filtered = currentFilter === 'all' ? MOCK_CALLS :
    MOCK_CALLS.filter(c =>
      currentFilter === 'urgent' ? c.alertLevel === 'urgent' :
      currentFilter === 'routine' ? c.alertLevel === 'routine' :
      currentFilter === 'clear' ? c.alertLevel === null : true
    );

  if (filtered.length === 0) {
    container.innerHTML = '<p style="color:var(--text-soft);font-size:14px;padding:20px 0;">No calls match this filter.</p>';
    return;
  }

  filtered.forEach(call => {
    const card = document.createElement('div');
    card.className = 'call-card';
    card.innerHTML = `
      <div class="call-card-header" onclick="openTranscript('${call.id}')">
        <span class="call-status-icon">${call.statusIcon}</span>
        <div class="call-meta">
          <p class="call-date">${call.date} · ${call.time}</p>
          <p class="call-duration">${call.duration}</p>
        </div>
        <p class="call-summary-preview">${call.summaryPreview}</p>
        <button class="call-expand-btn">View →</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function setCallFilter(filter, btnEl) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btnEl.classList.add('active');
  renderCallLog();
}

/* ============================================================
   TRANSCRIPT MODAL
   ============================================================ */

function openTranscript(callId) {
  const call = MOCK_CALLS.find(c => c.id === callId);
  if (!call) return;

  document.getElementById('modal-title').textContent = `Call on ${call.date} · ${call.time}`;
  document.getElementById('modal-sub').textContent = `Duration: ${call.duration}  ·  ${call.statusIcon} ${call.alertLevel === 'urgent' ? 'Urgent alert' : call.alertLevel === 'routine' ? 'Routine note' : 'All clear'}`;
  document.getElementById('modal-summary').innerHTML = `<strong>Summary:</strong> ${call.summary}`;

  const transcriptEl = document.getElementById('modal-transcript');
  if (call.transcript.length === 0) {
    transcriptEl.innerHTML = '<p style="color:var(--text-soft)">Full transcript not available for this call.</p>';
  } else {
    transcriptEl.innerHTML = call.transcript.map(line => `
      <div class="transcript-line">
        <p class="transcript-speaker ${line.speaker}">${line.speaker === 'sarah' ? 'Sarah (AI)' : 'Dorothy'}</p>
        <p>${line.text}</p>
      </div>
    `).join('');
  }

  document.getElementById('transcript-modal').classList.remove('hidden');
}

function expandCallTranscript(callId) {
  openTranscript(callId);
}

function closeModal() {
  document.getElementById('transcript-modal').classList.add('hidden');
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

/* ============================================================
   ALERTS
   ============================================================ */

function setAlertTab(tab, btnEl) {
  document.querySelectorAll('.alert-tab').forEach(b => b.classList.remove('active'));
  btnEl.classList.add('active');
  document.getElementById('alerts-urgent').classList.toggle('hidden', tab !== 'urgent');
  document.getElementById('alerts-routine').classList.toggle('hidden', tab !== 'routine');
}

function dismissAlertStrip() {
  document.getElementById('alert-strip').style.display = 'none';
}

/* ============================================================
   SCHEDULE
   ============================================================ */

document.querySelectorAll('.day-btn').forEach(btn => {
  btn.addEventListener('click', () => { btn.classList.toggle('active'); updateScheduleStatus(); });
});

function updateScheduleStatus() {
  const time = document.getElementById('sched-time')?.value || '09:00';
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  const timeStr = `${h12}:${String(m).padStart(2,'0')} ${ampm}`;
  const statusEl = document.getElementById('schedule-status-text');
  if (statusEl) statusEl.textContent = `Next call: tomorrow at ${timeStr} ET`;
}

document.getElementById('sched-time')?.addEventListener('change', updateScheduleStatus);

function saveSchedule() {
  const btn = document.querySelector('#panel-schedule .btn-primary');
  btn.textContent = 'Saved ✓';
  btn.style.background = 'var(--green)';
  setTimeout(() => {
    btn.textContent = 'Save Schedule';
    btn.style.background = '';
  }, 2000);
}

/* ============================================================
   MEMORY CARD
   ============================================================ */

document.querySelectorAll('#memory-topic-tags .topic-tag').forEach(tag => {
  tag.addEventListener('click', () => tag.classList.toggle('selected'));
});

document.querySelectorAll('#memory-appointments .list-item-remove, #memory-medications .list-item-remove').forEach(btn => {
  btn.addEventListener('click', () => btn.closest('.list-item').remove());
});

function addMemoryAppointment() {
  const list = document.getElementById('memory-appointments');
  const item = document.createElement('div');
  item.className = 'list-item';
  item.innerHTML = `
    <input type="date" class="list-item-date">
    <input type="text" placeholder="e.g. Doctor's appointment">
    <button class="list-item-remove" onclick="this.closest('.list-item').remove()">×</button>
  `;
  list.appendChild(item);
  item.querySelector('input[type="text"]').focus();
}

function addMemoryMedication() {
  const list = document.getElementById('memory-medications');
  const item = document.createElement('div');
  item.className = 'list-item';
  item.innerHTML = `
    <input type="text" placeholder="e.g. Aspirin 81mg — morning">
    <button class="list-item-remove" onclick="this.closest('.list-item').remove()">×</button>
  `;
  list.appendChild(item);
  item.querySelector('input').focus();
}

function addMemoryName(event) {
  if (event.key !== 'Enter') return;
  event.preventDefault();
  const input = event.target;
  const value = input.value.trim();
  if (!value) return;
  const tag = document.createElement('span');
  tag.className = 'name-tag';
  tag.innerHTML = `${escapeHtml(value)}<button onclick="this.parentElement.remove()">×</button>`;
  input.parentElement.insertBefore(tag, input);
  input.value = '';
}

function saveMemoryCard() {
  const btn = document.querySelector('#panel-memory .btn-primary');
  btn.textContent = 'Saved ✓';
  btn.style.background = 'var(--green)';
  setTimeout(() => {
    btn.textContent = 'Save Memory Card';
    btn.style.background = '';
  }, 2000);
}

/* ============================================================
   CALL NOW
   ============================================================ */

function callNow() {
  // TODO: trigger Twilio call via Firebase Function
  alert('Initiating call to Dorothy… (This will trigger the actual Twilio call in production.)');
}

/* ============================================================
   UTILITIES
   ============================================================ */

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ============================================================
   INIT
   ============================================================ */

renderCallCards();
renderCallLog();
updateScheduleStatus();
