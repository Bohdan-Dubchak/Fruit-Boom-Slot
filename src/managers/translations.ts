export type Language = 'lng_en' | 'lng_de' | 'lng_uk';

export type Translations = {
    settings: string,
    music: string,
    sound: string,
    screen: string,
    language: string,
};

export const translations: Record<Language, Translations> = {
    lng_en: {
        settings: 'Settings',
        music: 'Music',
        sound: 'Sound',
        language: 'Language',
        screen: "Full Screen"
    },

    lng_de: {
       settings: 'Einstellungen',
       music: 'Musik',
       sound: 'Klang',
       language: 'Sprache',
       screen: "Childbirths"
   },

    lng_uk: {
        settings: 'Налаштування',
        music: 'Музика',
        sound: 'Звук',
        language: 'Мова',
        screen: "Екран"
    }
}