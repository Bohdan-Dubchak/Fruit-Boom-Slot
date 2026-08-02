import {translations, type Language, type Translations} from "./translations.ts";

type LanguageChangeCallback = (language: Language) => void;

export class LanguageManager {
    private static flagNames = ['lng_en', 'lng_de', 'lng_uk'];
    private static languageCodes: Language[] = ['lng_en', 'lng_de', "lng_uk"];
    private static currentIndex = 0;
    private static listeners: LanguageChangeCallback[] = [];

    public static getCurrentFlag(): string {
        return this.flagNames[this.currentIndex];
    };

    public static getCurrentLanguage(): Language {
        return this.languageCodes[this.currentIndex];
    };

    public static switchLanguage(): Language {
        this.currentIndex = (this.currentIndex + 1) % this.languageCodes.length;
        const newLanguage = this.languageCodes[this.currentIndex];
        this.notifyListeners(newLanguage);
        return newLanguage;
    };

    public static t(key: keyof Translations): string {
        const currentLanguage = this.getCurrentLanguage();
        return translations[currentLanguage][key];
    };

    public static addListener(callback: LanguageChangeCallback): void {
        this.listeners.push(callback);
    };

    public static removeListener(callback: LanguageChangeCallback): void {
        const index = this.listeners.indexOf(callback);
        if (index !== -1) {
            this.listeners.splice(index, 1);
        }
    };

    private static notifyListeners(language: Language): void {
        this.listeners.forEach(callback => callback(language));
    };

    public static clearListeners(): void {
        this.listeners = [];
    };
}