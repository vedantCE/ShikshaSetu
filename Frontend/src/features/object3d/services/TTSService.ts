import Tts from 'react-native-tts';

class TTSService {
    private initialized = false;

    constructor() {
        this.init();
    }

    private init() {
        Tts.getInitStatus().then(() => {
            this.initialized = true;
            Tts.setDefaultLanguage('en-US');
            Tts.setDefaultRate(0.5);
        }, (err) => {
            if (err.code === 'no_engine') {
                Tts.requestInstallEngine();
            }
        });
    }

    speak(text: string) {
        if (this.initialized) {
            Tts.stop();
            Tts.speak(text);
        } else {
            console.warn('TTS not initialized yet');
        }
    }

    stop() {
        Tts.stop();
    }
}

export default new TTSService();
