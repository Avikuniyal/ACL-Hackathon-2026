function checkSpeechRecognitionEnabled() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.log("Speech recognition is not supported in this browser.");
  }
}
