// Village decoration items that can be purchased
export const villageItems = [
    {
        id: 'reindeer_statue',
        name: 'Reindeer Statue',
        description: 'A beautiful wooden reindeer statue',
        cost: 30,
        category: 'decoration',
        icon: '🦌',
        position: { x: 200, y: 300 }
    },
    {
        id: 'sami_flag',
        name: 'Sámi Flag',
        description: 'The colorful Sámi flag to fly proudly',
        cost: 25,
        category: 'decoration',
        icon: '🏳️',
        position: { x: 150, y: 200 }
    },
    {
        id: 'goahti',
        name: 'Traditional Goahti',
        description: 'A cozy traditional Sámi dwelling',
        cost: 50,
        category: 'building',
        icon: '🏠',
        position: { x: 400, y: 400 }
    },
    {
        id: 'fire_pit',
        name: 'Fire Pit',
        description: 'A warm fire pit for gathering',
        cost: 35,
        category: 'decoration',
        icon: '🔥',
        position: { x: 500, y: 350 }
    },
    {
        id: 'duodji_workshop',
        name: 'Duodji Workshop',
        description: 'A workshop for creating traditional crafts',
        cost: 60,
        category: 'building',
        icon: '🛠️',
        position: { x: 600, y: 400 }
    },
    {
        id: 'reindeer_pen',
        name: 'Reindeer Pen',
        description: 'A safe place for reindeer to rest',
        cost: 45,
        category: 'building',
        icon: '🦌',
        position: { x: 300, y: 500 }
    },
    {
        id: 'berry_bush',
        name: 'Berry Bushes',
        description: 'Delicious cloudberries and lingonberries',
        cost: 20,
        category: 'decoration',
        icon: '🫐',
        position: { x: 700, y: 300 }
    },
    {
        id: 'northern_lights',
        name: 'Northern Lights Display',
        description: 'Magical aurora lights in the sky',
        cost: 75,
        category: 'decoration',
        icon: '🌌',
        position: { x: 400, y: 150 }
    },
    {
        id: 'fishing_spot',
        name: 'Fishing Spot',
        description: 'A peaceful spot for fishing',
        cost: 40,
        category: 'decoration',
        icon: '🎣',
        position: { x: 800, y: 450 }
    },
    {
        id: 'sami_pattern_banner',
        name: 'Sámi Pattern Banner',
        description: 'Beautiful traditional pattern decorations',
        cost: 30,
        category: 'decoration',
        icon: '🎨',
        position: { x: 250, y: 250 }
    }
];

export function getVillageItem(id) {
    return villageItems.find(item => item.id === id);
}

export function getVillageItemsByCategory(category) {
    return villageItems.filter(item => item.category === category);
}

