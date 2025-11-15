// Game configuration and constants
export const GAME_CONFIG = {
    width: 1280,
    height: 720,
    type: Phaser.AUTO,
    parent: 'game-container',
    backgroundColor: '#2c3e50',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: {
            width: 800,
            height: 450
        },
        max: {
            width: 1920,
            height: 1080
        }
    }
};

// Artifact types
export const ARTIFACTS = {
    RUNEBOMME: 'runebomme',
    REINDEER_AMULET: 'reindeer_amulet',
    DUODJI_PATTERN: 'duodji_pattern',
    YOIK_CRYSTAL: 'yoik_crystal',
    HISTORY_SCROLL: 'history_scroll',
    ENVIRONMENTAL_STONE: 'environmental_stone',
    WISDOM_TOKEN: 'wisdom_token'
};

// Scene keys
export const SCENES = {
    MENU: 'MenuScene',
    INTRO: 'IntroScene',
    WORLD_MAP: 'WorldMapScene',
    VILLAGE: 'VillageScene',
    LANGUAGE_PUZZLE: 'LanguagePuzzleScene',
    REINDEER_HERDING: 'ReindeerHerdingScene',
    DUODJI_CRAFTING: 'DuodjiCraftingScene',
    ENVIRONMENTAL_CHALLENGE: 'EnvironmentalChallengeScene',
    YOIK_PUZZLE: 'YoikPuzzleScene',
    HISTORY_TIMELINE: 'HistoryTimelineScene',
    MORAL_CHOICE: 'MoralChoiceScene',
    FINAL_MISSION: 'FinalMissionScene'
};

// Colors
export const COLORS = {
    PRIMARY: '#3498db',
    SECONDARY: '#2ecc71',
    ACCENT: '#e74c3c',
    TEXT: '#ecf0f1',
    BACKGROUND: '#2c3e50',
    UI_BG: 'rgba(0, 0, 0, 0.7)',
    BUTTON: '#34495e',
    BUTTON_HOVER: '#5a6c7d'
};

