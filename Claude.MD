# ACL Hackathon: Voice-Cloned Family Connection App

## Project Overview
An AI-powered communication tool that allows family members to clone their voice to stay in touch with seniors (e.g., "Grandma Dorothy") through scheduled calls and an "Ask a Question" interface.

## Tech Stack
- **Frontend:** HTML, Tailwind CSS
- **Backend:** Firebase (Auth, Firestore, Functions, Storage)
- **AI/Voice:** Groq (LLM), ElevenLabs (Voice Cloning)
- **Telephony:** Twilio API

## UI/UX Design Principles
- [cite_start]**Family Member Side:** Emotional, warm colors, family imagery[cite: 11].
- **Grandma’s Side:** Accessibility-first. [cite_start]Minimum 20px-24px font[cite: 166]. [cite_start]High contrast[cite: 167]. [cite_start]No tech jargon (no "AI" or "Cloning" mentions)[cite: 165]. [cite_start]Large buttons (80px+ height)[cite: 201].

## Build Order Reference
Follow the Phased approach in the documentation:
1. [cite_start]Phase 1: Core Tech Proof (Groq + ElevenLabs)[cite: 297].
2. [cite_start]Phase 2: Twilio Integration[cite: 319].
3. [cite_start]Phase 3: Safety Layer (Alerts)[cite: 343].
4. [cite_start]Phase 4: Database Layer[cite: 353].
5. [cite_start]Phase 5 & 6: Sarah & Grandma Frontends[cite: 368, 406].