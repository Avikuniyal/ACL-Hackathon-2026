/* Stay Close — invite.js (Dorothy's consent page) */

/* ============================================================
   LOAD SARAH'S INFO FROM URL PARAM
   ============================================================ */

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function loadSarahData() {
  const userId     = getParam('userId');
  const sarahName  = getParam('name')  || 'Sarah';
  const dorothyName = getParam('for') || 'Dorothy';
  const photoURL   = getParam('photo') || null;

  if (!userId) {
    showFallbackError();
    return;
  }

  // Personalize text
  document.getElementById('invite-greeting').textContent  = `Hi ${dorothyName}! 👋`;
  document.getElementById('invite-from').textContent      = `${sarahName} set this up for you 💛`;
  document.getElementById('confirm-sub').textContent      = `${sarahName} will be so happy 💛`;
  document.getElementById('sarah-initial').textContent    = sarahName.charAt(0).toUpperCase();

  // Load photo if available
  if (photoURL) {
    const photo = document.getElementById('sarah-photo');
    photo.innerHTML = `<img src="${photoURL}" alt="${sarahName}">`;
  }

  // Store IDs for consent submission
  window._userId = userId;
  window._sarahName = sarahName;
  window._dorothyName = dorothyName;
}

function showFallbackError() {
  document.getElementById('view-invite').innerHTML = `
    <div class="invite-card center-card">
      <p style="font-size:24px;color:#555;text-align:center;line-height:1.7;">
        Something doesn't look quite right with this link.<br><br>
        Please ask the person who sent it to send it again.
      </p>
    </div>
  `;
}

/* ============================================================
   iOS / ANDROID IN-APP BROWSER DETECTION
   ============================================================ */

function detectBrowser() {
  const ua = navigator.userAgent;
  const isInAppBrowser = /FBAN|FBAV|Instagram|Messenger|Twitter|LinkedInApp/i.test(ua);
  const isApple = /iPhone|iPad|iPod/i.test(ua);

  if (isInAppBrowser && isApple) {
    document.getElementById('browser-warning').classList.remove('hidden');
  }
}

/* ============================================================
   INSTALL INSTRUCTIONS — detect platform
   ============================================================ */

function showInstallInstructions() {
  const ua = navigator.userAgent;
  const isIOS     = /iPhone|iPad|iPod/i.test(ua);
  const isAndroid = /Android/i.test(ua);

  document.getElementById('generic-install').classList.add('hidden');

  if (isIOS) {
    document.getElementById('ios-install').classList.remove('hidden');
  } else if (isAndroid) {
    document.getElementById('android-install').classList.remove('hidden');
  } else {
    document.getElementById('generic-install').classList.remove('hidden');
  }

  // Update skip link with correct URL including userId
  const userId = window._userId;
  if (userId) {
    document.getElementById('skip-to-app').href = `grandma.html?userId=${encodeURIComponent(userId)}`;
  }
}

/* ============================================================
   HANDLERS
   ============================================================ */

function handleAccept() {
  const btn = document.querySelector('.btn-yes');
  btn.textContent = 'Saving…';
  btn.disabled = true;

  // TODO: call Firebase Function handleConsent to update consentStatus to "accepted"
  // fetch('/api/consent', { method: 'POST', body: JSON.stringify({ userId: window._userId, status: 'accepted' }) })

  setTimeout(() => {
    showView('view-confirmed');
    showInstallInstructions();
  }, 600);
}

function handleDecline() {
  const btn = document.querySelector('.btn-no');
  btn.textContent = 'Noted…';
  btn.disabled = true;

  // TODO: call Firebase Function to update consentStatus to "declined" and notify Sarah
  setTimeout(() => {
    showView('view-declined');
  }, 400);
}

function handleAdded() {
  // Navigate to grandma's app
  const userId = window._userId;
  const url = userId ? `grandma.html?userId=${encodeURIComponent(userId)}` : 'grandma.html';
  window.location.href = url;
}

/* ============================================================
   VIEW HELPER
   ============================================================ */

function showView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(viewId).classList.add('active');
  window.scrollTo(0, 0);
}

/* ============================================================
   INIT
   ============================================================ */

detectBrowser();
loadSarahData();
