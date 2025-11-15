// Historical events for the timeline quest
export const historyEvents = [
    {
        id: 'ancient_times',
        title: 'Ancient Sámi Culture',
        year: 'Pre-1000',
        description: 'Sámi people have lived in Sápmi for thousands of years, with a rich culture based on reindeer herding, fishing, and traditional knowledge.',
        position: 0
    },
    {
        id: 'kautokeino',
        title: 'Kautokeino Uprising',
        year: '1852',
        description: 'A significant event where Sámi people in Kautokeino protested against unfair treatment and cultural suppression.',
        position: 1
    },
    {
        id: 'assimilation',
        title: 'Assimilation Policies',
        year: '1850-1950',
        description: 'Difficult period when Sámi language and culture were suppressed. Children were often not allowed to speak Sámi in schools.',
        position: 2
    },
    {
        id: 'linguistic_revitalization',
        title: 'Linguistic Revitalization',
        year: '1970s-1980s',
        description: 'Sámi people began working to preserve and revitalize their languages, establishing Sámi language education and media.',
        position: 3
    },
    {
        id: 'sami_parliament',
        title: 'Sámi Parliament Established',
        year: '1989',
        description: 'The Sámi Parliament of Norway was established, giving Sámi people a voice in political decisions affecting their communities.',
        position: 4
    },
    {
        id: 'modern_rights',
        title: 'Modern Sámi Rights',
        year: '2000s-Present',
        description: 'Continued work on Sámi rights, language preservation, land rights, and recognition of Sámi as an Indigenous people.',
        position: 5
    }
];

// Get events sorted by year
export function getEventsSorted() {
    return [...historyEvents].sort((a, b) => {
        // Extract numeric year for comparison
        const yearA = parseInt(a.year.split('-')[0]);
        const yearB = parseInt(b.year.split('-')[0]);
        return yearA - yearB;
    });
}

