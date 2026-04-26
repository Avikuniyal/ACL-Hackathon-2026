/* Stay Close — index.js (Landing, Sign Up, Log In) */

function showView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(viewId).classList.add('active');
  window.scrollTo(0, 0);
}

function showError(elementId, message) {
  const el = document.getElementById(elementId);
  el.textContent = message;
  el.classList.remove('hidden');
}

function clearError(elementId) {
  const el = document.getElementById(elementId);
  el.textContent = '';
  el.classList.add('hidden');
}

function handleSignup(event) {
  event.preventDefault();
  clearError('signup-error');

  const name     = document.getElementById('signup-name').value.trim();
  const email    = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;

  if (!name) { showError('signup-error', 'Please enter your name.'); return; }
  if (!email || !email.includes('@')) { showError('signup-error', 'Please enter a valid email address.'); return; }
  if (password.length < 8) { showError('signup-error', 'Password must be at least 8 characters.'); return; }

  const btn = event.target.querySelector('button[type="submit"]');
  btn.textContent = 'Creating account…';
  btn.disabled = true;

  // TODO: Firebase Auth — createUserWithEmailAndPassword(auth, email, password)
  setTimeout(() => {
    sessionStorage.setItem('userName', name);
    window.location.href = 'setup.html';
  }, 800);
}

function handleLogin(event) {
  event.preventDefault();
  clearError('login-error');

  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  if (!email) { showError('login-error', 'Please enter your email address.'); return; }
  if (!password) { showError('login-error', 'Please enter your password.'); return; }

  const btn = event.target.querySelector('button[type="submit"]');
  btn.textContent = 'Signing in…';
  btn.disabled = true;

  // TODO: Firebase Auth — signInWithEmailAndPassword(auth, email, password)
  

  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 800);
}

function handleGoogleSignIn() {
  // TODO: Firebase Auth — signInWithPopup(auth, new GoogleAuthProvider())
  window.location.href = 'setup.html';
}

const functions = require("Firebase-functions");

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});
