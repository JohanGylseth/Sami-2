// Game content, educational text, and story elements
export const gameContent = {
    story: {
        introduction: [
            "Welcome, young apprentice...",
            "You have been chosen as a Yoik Guardian Apprentice.",
            "Your mission is to protect the cultural treasures of Sápmi."
        ],
        artifactExplanation: "Each artifact holds important knowledge about Sámi culture, history, and traditions."
    },
    
    educational: {
        whoAreSami: "The Sámi are an Indigenous people living in Sápmi, which spans across northern Norway, Sweden, Finland, and Russia. They have a rich culture with their own languages, traditions, and ways of life.",
        
        sapmi: "Sápmi is the traditional homeland of the Sámi people. It covers a large area in northern Europe, including parts of Norway, Sweden, Finland, and Russia.",
        
        reindeerHerding: "Reindeer herding is a traditional Sámi livelihood. Herders guide their reindeer across vast areas, following seasonal migration patterns. This requires deep knowledge of the land, weather, and animals.",
        
        duodji: "Duodji is traditional Sámi handicraft. It includes making clothing, tools, and decorative items using traditional techniques and patterns. Each region has its own distinctive patterns and colors.",
        
        joik: "Joik is a traditional Sámi form of music. It is a way of expressing connection to people, places, or feelings. Joik is personal and meaningful, not just entertainment.",
        
        language: "There are several Sámi languages, with Northern Sámi being the most widely spoken. Language revitalization efforts have been important in preserving Sámi culture.",
        
        history: "Sámi people have lived in Sápmi for thousands of years. They have faced challenges including assimilation policies, but have worked hard to preserve and revitalize their culture and rights.",
        
        modernLife: "Today, Sámi people live modern lives while maintaining their cultural traditions. They work in many professions, from traditional livelihoods to modern careers, all while preserving their cultural identity."
    },
    
    challenges: {
        languagePuzzle: {
            title: "Learn Sámi Words",
            instruction: "Match the Sámi words to their meanings. Click on a word, then click on the correct picture or translation.",
            success: "Excellent! You're learning the Sámi language!",
            failure: "Try again! Learning a new language takes practice."
        },
        reindeerHerding: {
            title: "Guide the Reindeer",
            instruction: "Use arrow keys to guide the reindeer herd to the safe grazing area. Avoid predators and harsh weather!",
            success: "Well done! You've successfully guided the herd!",
            failure: "The herd needs your help. Try again!"
        },
        duodjiCrafting: {
            title: "Create Traditional Patterns",
            instruction: "Drag pattern pieces to create a traditional Sámi design. Use colors and shapes that reflect Sámi culture.",
            success: "Beautiful work! You've created a traditional pattern!",
            failure: "Keep trying! Traditional patterns have specific meanings."
        },
        environmental: {
            title: "Balance the Ecosystem",
            instruction: "Manage resources carefully. Balance reindeer grazing, fishing, and other activities to keep the ecosystem healthy.",
            success: "Perfect balance! You understand traditional ecological knowledge!",
            failure: "The ecosystem needs better balance. Try again!"
        },
        yoik: {
            title: "Learn About Joik",
            instruction: "Listen to the rhythm patterns and repeat them. Learn about the importance of joik in Sámi culture.",
            success: "Wonderful! You understand the beauty of joik!",
            failure: "Keep practicing! Joik connects us to our culture."
        },
        history: {
            title: "Sámi History Timeline",
            instruction: "Place historical events in the correct order on the timeline. Learn about important moments in Sámi history.",
            success: "Excellent! You understand Sámi history!",
            failure: "History teaches us important lessons. Try again!"
        },
        moralChoice: {
            title: "Make a Choice",
            instruction: "Think carefully about your decision. Consider respect for land, animals, and cultural heritage.",
            success: "A wise choice! You understand the values of Sámi culture.",
            failure: "Every choice matters. Consider the consequences."
        }
    },
    
    moralChoices: [
        {
            id: 'choice1',
            scenario: "You see someone picking rare plants in a protected area. What do you do?",
            options: [
                {
                    text: "Tell them to stop and explain why the area is protected",
                    correct: true,
                    explanation: "Respecting protected areas shows understanding of environmental stewardship."
                },
                {
                    text: "Ignore it - it's not your problem",
                    correct: false,
                    explanation: "We all have a responsibility to protect the environment."
                },
                {
                    text: "Join them in picking plants",
                    correct: false,
                    explanation: "Protected areas need our respect and care."
                }
            ]
        },
        {
            id: 'choice2',
            scenario: "You find an old Sámi artifact. What should you do?",
            options: [
                {
                    text: "Report it to local Sámi authorities or museum",
                    correct: true,
                    explanation: "Cultural artifacts belong to the community and should be handled with respect."
                },
                {
                    text: "Keep it as a souvenir",
                    correct: false,
                    explanation: "Cultural artifacts are important to the community and should be shared."
                },
                {
                    text: "Sell it",
                    correct: false,
                    explanation: "Cultural artifacts have value beyond money - they represent heritage."
                }
            ]
        },
        {
            id: 'choice3',
            scenario: "A reindeer herd is blocking a road. How do you respond?",
            options: [
                {
                    text: "Wait patiently for the herd to pass",
                    correct: true,
                    explanation: "Reindeer herding is a traditional livelihood that requires patience and respect."
                },
                {
                    text: "Honk your horn to hurry them along",
                    correct: false,
                    explanation: "This could stress the animals and disrupt the herder's work."
                },
                {
                    text: "Drive around them quickly",
                    correct: false,
                    explanation: "This could harm the animals and is dangerous."
                }
            ]
        }
    ]
};

