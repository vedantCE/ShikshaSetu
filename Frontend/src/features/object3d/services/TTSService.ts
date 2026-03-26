import Tts from 'react-native-tts';

// Service to read text aloud for students
// Used in detail screen when student taps speaker button
class TTSService {
    private initialized = false;

    constructor() {
        this.init();
    }

    // Set up the text-to-speech engine on app start
    private init() {
        Tts.getInitStatus().then(() => {
            this.initialized = true;
            Tts.setDefaultLanguage('en-US');
            Tts.setDefaultRate(0.5); // 0.5 = slower speech for better understanding
        }, (err) => {
            if (err.code === 'no_engine') {
                Tts.requestInstallEngine();
            }
        });
    }

    // Read the given text aloud
    speak(text: string) {
        if (this.initialized) {
            Tts.stop(); // Stop any currently playing audio first
            Tts.speak(text);
        } else {
            console.warn('TTS not initialized yet');
        }
    }

    // Stop any currently playing audio
    stop() {
        Tts.stop();
    }
}

// Export single instance to use across the app
export default new TTSService();
