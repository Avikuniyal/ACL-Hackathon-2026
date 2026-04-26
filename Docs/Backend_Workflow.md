Here's the exact build order — each step unlocks the next, nothing is built before it's needed:

Phase 1 — Prove the Core Tech Works (Before Building Any UI)
The goal here is just to confirm your three most critical tools actually work before writing a single screen.
Step 1 — Set Up Firebase
Create Firebase project
Enable Firestore, Firebase Auth, Firebase Storage, Firebase Functions
Install Firebase CLI on your computer
Initialize functions folder locally
Confirm you can deploy a simple "Hello World" function and it runs
Step 2 — Test Groq
Inside getAIResponse.js, write a function that takes a text message and returns Groq's response
Test it by calling it manually with a hardcoded message like "How are you today?"
Confirm you get a response back before moving on
Step 3 — Test ElevenLabs
Inside synthesizeVoice.js, write a function that takes a text string and returns an audio URL using a placeholder pre-built voice
Test it by passing in a short sentence and confirming audio comes back
Don't touch voice cloning yet — just confirm the pipeline works
Step 4 — Connect Groq → ElevenLabs Together
Chain the two functions: text goes in → Groq responds → ElevenLabs speaks the response
This is the core loop of your entire app — confirm it works end to end before touching Twilio

Phase 2 — Get a Real Phone Call Working
Step 5 — Set Up Twilio
Create Twilio account, grab your free trial credits
Get a Twilio phone number
Add your demo phone number to the verified numbers list
Confirm you can make a basic outbound call that just says "Hello" using Twilio's API
Step 6 — Build handleCall.js
When Twilio calls grandma and she picks up, this function runs
It should: answer the call → say an opening message → listen for grandma's response → transcribe what she said → pass it to Groq → pass Groq's response to ElevenLabs → play the audio back
Test this by calling your own phone and having a short back-and-forth conversation
Step 7 — Build scheduleCall.js
Set up Firebase Scheduler to trigger at a specific time
When it fires, it reads grandma's phone number and calls Twilio to initiate the call
Test by setting the schedule to 2 minutes from now and watching it fire automatically
Step 8 — Build endCall.js
When the call ends, save the full transcript to Firestore
Also save duration and timestamp
Test by checking Firestore after a test call and confirming the data appeared

Phase 3 — Add the Safety Layer
Step 9 — Build checkForAlerts.js
Takes the transcript from endCall.js
Scans for keywords: "fell", "scared", "hurt", "don't feel good", "can't breathe", "pain"
Returns either urgent, routine, or null
Test by passing in a fake transcript with and without alert words
Step 10 — Build sendAlert.js
If checkForAlerts.js returns urgent, this fires a Twilio SMS to Sarah
Message: "⚠️ Dorothy may need your attention — tap here to see what she said [link]"
Test by manually triggering it and confirming the text arrives on Sarah's phone

Phase 4 — Build the Database Layer
Step 11 — Build createUser.js
Saves Sarah's name, photo URL, relationship, nickname to Firestore
Also saves grandma's name and phone number
Test by calling it with fake data and checking Firestore
Step 12 — Build saveMemoryCard.js
Saves medications, appointments, friends, topics, phrases to Firestore under the user
Also handles updates — if Sarah edits the memory card later, this overwrites the old data
Test by saving and then updating a memory card entry
Step 13 — Build handleConsent.js
Sends the invite SMS to grandma via Twilio
Sets consentStatus: "pending" in Firestore
When grandma taps Yes on the invite page, updates to "accepted" and notifies Sarah
When grandma taps No, updates to "declined" and notifies Sarah
Test all three states

Phase 5 — Build Sarah's Frontend
Only start this after the backend fully works — that way you're wiring up real working functions, not guessing.
Step 14 — Landing Page + Sign Up screen
Basic HTML/CSS page
Sign up form calls Firebase Auth to create account
On success, redirect to Relationship Setup
Step 15 — Relationship Setup screen
Name, nickname, relationship dropdown, photo upload
Photo uploads to Firebase Storage
Form data calls createUser.js
Step 16 — Voice Recording screen
Mic recording in sets of 5 sentences
Save progress to localStorage between sets
On completion, audio sent to Firebase Storage
Voice ID returned from ElevenLabs saved to Firestore via synthesizeVoice.js
Step 17 — Memory Card screen
Simple form with all the fields
On submit calls saveMemoryCard.js
All fields optional, skip buttons on each
Step 18 — Send Invite screen
Phone number input
Preview of the SMS message, editable
On send calls handleConsent.js
Redirects to Waiting Room
Step 19 — Waiting Room screen
Polls Firestore every 10 seconds checking consentStatus
When it flips to "accepted" → automatically redirect to Schedule Setup
Resend and manual call buttons
Step 20 — Schedule Setup screen
Time picker
Day toggles
On save, writes schedule to Firestore and activates scheduleCall.js
Step 21 — Dashboard screen
Reads call logs from Firestore in real time using Firebase's onSnapshot listener
Shows urgent alerts at top in red
Shows routine summaries below
Quick action buttons: Update Memory Card, Change Schedule, Call Dorothy Now

Phase 6 — Build Grandma's Frontend
Step 22 — Invite Landing Page
Sarah's photo, her name, plain english explanation
Two big buttons — Yes and No
On Yes → calls handleConsent.js → redirects to confirmation
On No → calls handleConsent.js → shows gentle goodbye
Step 23 — Confirmation + PWA Install screen
Celebration message
Illustrated Add to Home Screen instructions
Detects iOS vs Android and shows the right instructions
Step 24 — Grandma's Home Screen
Sarah's photo, big Call button, smaller Ask a Question button
Reads Sarah's name and photo from Firestore on load
Step 25 — Active Call Screen
Pulsing animation while call is live
Single End Call button
Step 26 — Ask a Question Screen
Large mic button as primary input
Calls getAIResponse.js then synthesizeVoice.js
Displays answer in large text and plays audio automatically
Step 27 — Answer Screen
Shows response text large
Auto plays cloned voice audio
Ask Another and Go Home buttons

Phase 7 — Polish and Demo Prep
Step 28 — PWA Manifest
Add manifest.json so grandma's app can be added to home screen properly
Add correct icons for iOS and Android
Step 29 — In-App Browser Detection
Detect if grandma opened the invite link inside iMessage's browser
Show a banner: "Please open this in Safari for the best experience"
Step 30 — Swap in Real Cloned Voice
Pay the $5 for ElevenLabs Starter
Record Sarah's voice using the 20 sentence flow
Replace placeholder voice ID with real cloned voice ID in Firestore
One line change
Step 31 — Pre-Demo Checklist
Verified phone numbers added to Twilio
Test call fired and confirmed working
Firebase rules set so data is secure
Memory card filled with realistic demo data
Schedule set to a time during your demo slot

The Full Order at a Glance
Phase 1: Firebase → Groq → ElevenLabs → Chain them
Phase 2: Twilio setup → handleCall → scheduleCall → endCall
Phase 3: checkForAlerts → sendAlert
Phase 4: createUser → saveMemoryCard → handleConsent
Phase 5: Sarah's 8 screens (14 → 21)
Phase 6: Grandma's 6 screens (22 → 27)
Phase 7: PWA → browser detection → real voice → demo prep

Want to start writing the actual code for Phase 1 now?
