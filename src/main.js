import Phaser from 'phaser';
import { GAME_CONFIG } from './config.js';
import { SCENES } from './config.js';

// Import scenes
import MenuScene from './scenes/MenuScene.js';
import IntroScene from './scenes/IntroScene.js';
import WorldMapScene from './scenes/WorldMapScene.js';
import VillageScene from './scenes/VillageScene.js';
import LanguagePuzzleScene from './scenes/LanguagePuzzleScene.js';
import ReindeerHerdingScene from './scenes/ReindeerHerdingScene.js';
import DuodjiCraftingScene from './scenes/DuodjiCraftingScene.js';
import EnvironmentalChallengeScene from './scenes/EnvironmentalChallengeScene.js';
import YoikPuzzleScene from './scenes/YoikPuzzleScene.js';
import HistoryTimelineScene from './scenes/HistoryTimelineScene.js';
import MoralChoiceScene from './scenes/MoralChoiceScene.js';
import FinalMissionScene from './scenes/FinalMissionScene.js';

// Initialize game
const config = {
    ...GAME_CONFIG,
    scene: [
        MenuScene,
        IntroScene,
        WorldMapScene,
        VillageScene,
        LanguagePuzzleScene,
        ReindeerHerdingScene,
        DuodjiCraftingScene,
        EnvironmentalChallengeScene,
        YoikPuzzleScene,
        HistoryTimelineScene,
        MoralChoiceScene,
        FinalMissionScene
    ]
};

const game = new Phaser.Game(config);

// Make game instance globally available for debugging
window.game = game;

