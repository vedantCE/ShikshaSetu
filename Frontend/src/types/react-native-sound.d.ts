declare module 'react-native-sound' {
  export default class Sound {
    static MAIN_BUNDLE: number;
    constructor(filename: string, basePath: number, callback: (error: any) => void);
    play(callback?: (success: boolean) => void): void;
    release(): void;
  }
}
