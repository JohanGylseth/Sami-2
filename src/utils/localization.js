// Localization system (for future multilingual support)
export const translations = {
    no: {
        // Norwegian translations
        start: 'Start',
        continue: 'Fortsett',
        instructions: 'Instruksjoner',
        tokens: 'Tokens',
        artifacts: 'Artifakter',
        close: 'Lukk',
        next: 'Neste',
        back: 'Tilbake'
    },
    en: {
        // English translations
        start: 'Start',
        continue: 'Continue',
        instructions: 'Instructions',
        tokens: 'Tokens',
        artifacts: 'Artifacts',
        close: 'Close',
        next: 'Next',
        back: 'Back'
    }
};

let currentLanguage = 'no';

export function setLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
    }
}

export function t(key) {
    return translations[currentLanguage][key] || key;
}

