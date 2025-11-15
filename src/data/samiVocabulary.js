// Northern Sámi vocabulary for the language puzzle
export const samiVocabulary = [
    {
        word: 'boazu',
        translation: 'reindeer',
        category: 'animals',
        pronunciation: 'BOA-zu'
    },
    {
        word: 'gáica',
        translation: 'fox',
        category: 'animals',
        pronunciation: 'GAI-tsa'
    },
    {
        word: 'riekti',
        translation: 'ptarmigan',
        category: 'animals',
        pronunciation: 'RIEK-ti'
    },
    {
        word: 'guovža',
        translation: 'bear',
        category: 'animals',
        pronunciation: 'GUOV-zha'
    },
    {
        word: 'loddi',
        translation: 'bird',
        category: 'animals',
        pronunciation: 'LOD-di'
    },
    {
        word: 'čáhci',
        translation: 'water',
        category: 'nature',
        pronunciation: 'CHAH-tsi'
    },
    {
        word: 'muohtu',
        translation: 'snow',
        category: 'nature',
        pronunciation: 'MUOH-tu'
    },
    {
        word: 'beaivi',
        translation: 'sun',
        category: 'nature',
        pronunciation: 'BEA-ivi'
    },
    {
        word: 'mánnu',
        translation: 'moon',
        category: 'nature',
        pronunciation: 'MAN-nu'
    },
    {
        word: 'vuovdi',
        translation: 'forest',
        category: 'nature',
        pronunciation: 'VUOV-di'
    },
    {
        word: 'gákti',
        translation: 'traditional Sámi clothing',
        category: 'culture',
        pronunciation: 'GAK-ti'
    },
    {
        word: 'joiku',
        translation: 'to joik (sing)',
        category: 'culture',
        pronunciation: 'JOI-ku'
    },
    {
        word: 'duodji',
        translation: 'traditional handicraft',
        category: 'culture',
        pronunciation: 'DUOD-ji'
    },
    {
        word: 'goahti',
        translation: 'traditional Sámi dwelling',
        category: 'culture',
        pronunciation: 'GOAH-ti'
    },
    {
        word: 'Sápmi',
        translation: 'Sámi homeland',
        category: 'culture',
        pronunciation: 'SAP-mi'
    }
];

// Get vocabulary by category
export function getVocabularyByCategory(category) {
    return samiVocabulary.filter(item => item.category === category);
}

// Get random vocabulary items
export function getRandomVocabulary(count = 5) {
    const shuffled = [...samiVocabulary].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, samiVocabulary.length));
}

