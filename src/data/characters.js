// Character definitions and dialogues
export const characters = {
    elder: {
        id: 'elder',
        name: 'Elder Áile',
        role: 'Teacher and Guardian',
        color: 0x8b4513,
        greeting: 'Welcome, young apprentice. I am here to help you learn.',
        dialog: 'The Sámi language is beautiful and important. Each word carries the wisdom of our ancestors.',
        knowledge: 'I can teach you about Sámi words and their meanings.'
    },
    reindeerHerder: {
        id: 'reindeerHerder',
        name: 'Máret the Herder',
        role: 'Reindeer Herder',
        color: 0x3498db,
        greeting: 'Hello! I guide reindeer across Sápmi.',
        dialog: 'Reindeer herding is not just a job - it is a way of life. We must understand the seasons, the land, and the animals.',
        knowledge: 'Reindeer migrate with the seasons. In winter, they need protection from predators and harsh weather.'
    },
    craftsperson: {
        id: 'craftsperson',
        name: 'Sara the Craftsperson',
        role: 'Duodji Artist',
        color: 0xe74c3c,
        greeting: 'Welcome! I create traditional Sámi crafts.',
        dialog: 'Duodji is our traditional handicraft. Each pattern tells a story and connects us to our ancestors.',
        knowledge: 'Traditional patterns use specific colors and shapes. Red, blue, yellow, and green are common colors in Sámi duodji.'
    },
    fisherman: {
        id: 'fisherman',
        name: 'Johan the Fisherman',
        role: 'Fisherman',
        color: 0x2ecc71,
        greeting: 'Good day! I fish in the rivers and lakes of Sápmi.',
        dialog: 'Fishing has always been important for Sámi people. We must respect the water and take only what we need.',
        knowledge: 'Traditional ecological knowledge teaches us to maintain balance. Too much fishing harms the ecosystem.'
    },
    joiker: {
        id: 'joiker',
        name: 'Elle the Joiker',
        role: 'Musician',
        color: 0x9b59b6,
        greeting: 'Hello! I share stories through joik.',
        dialog: 'Joik is not just singing - it is a way of connecting with people, places, and memories. Each joik is personal and meaningful.',
        knowledge: 'Joik is a traditional Sámi form of music. It is not a song about something, but rather a way of being with that person, place, or feeling.'
    },
    historian: {
        id: 'historian',
        name: 'Anders the Historian',
        role: 'Keeper of Stories',
        color: 0x34495e,
        greeting: 'Welcome! I preserve the history of our people.',
        dialog: 'Understanding our history helps us understand who we are today. The past teaches us important lessons.',
        knowledge: 'Sámi people have faced many challenges, but we have also achieved great things in preserving our culture and rights.'
    }
};

// Get character by ID
export function getCharacter(id) {
    return characters[id] || null;
}

// Get all characters
export function getAllCharacters() {
    return Object.values(characters);
}

