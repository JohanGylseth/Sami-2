// Progress tracking and save/load system
export class ProgressTracker {
    constructor() {
        this.loadProgress();
    }

    loadProgress() {
        const saved = localStorage.getItem('samiQuestProgress');
        if (saved) {
            const data = JSON.parse(saved);
            this.artifacts = data.artifacts || [];
            this.tokens = data.tokens || 0;
            this.completedChallenges = data.completedChallenges || [];
            this.currentChapter = data.currentChapter || 1;
            this.moralChoices = data.moralChoices || {};
        } else {
            this.reset();
        }
    }

    reset() {
        this.artifacts = [];
        this.tokens = 0;
        this.completedChallenges = [];
        this.currentChapter = 1;
        this.moralChoices = {};
        this.saveProgress();
    }

    saveProgress() {
        const data = {
            artifacts: this.artifacts,
            tokens: this.tokens,
            completedChallenges: this.completedChallenges,
            currentChapter: this.currentChapter,
            moralChoices: this.moralChoices,
            lastSaved: Date.now()
        };
        localStorage.setItem('samiQuestProgress', JSON.stringify(data));
    }

    addArtifact(artifactType) {
        if (!this.artifacts.includes(artifactType)) {
            this.artifacts.push(artifactType);
            this.saveProgress();
            return true;
        }
        return false;
    }

    hasArtifact(artifactType) {
        return this.artifacts.includes(artifactType);
    }

    addTokens(amount) {
        this.tokens += amount;
        this.saveProgress();
    }

    completeChallenge(challengeName) {
        if (!this.completedChallenges.includes(challengeName)) {
            this.completedChallenges.push(challengeName);
            this.saveProgress();
            return true;
        }
        return false;
    }

    isChallengeCompleted(challengeName) {
        return this.completedChallenges.includes(challengeName);
    }

    recordMoralChoice(choiceId, choice) {
        this.moralChoices[choiceId] = choice;
        this.saveProgress();
    }

    getMoralChoice(choiceId) {
        return this.moralChoices[choiceId];
    }

    getAllArtifacts() {
        return this.artifacts;
    }

    getTokenCount() {
        return this.tokens;
    }

    getProgressPercentage() {
        const totalChallenges = 7; // Total number of challenges
        return Math.round((this.completedChallenges.length / totalChallenges) * 100);
    }
}

// Singleton instance
let progressTrackerInstance = null;

export function getProgressTracker() {
    if (!progressTrackerInstance) {
        progressTrackerInstance = new ProgressTracker();
    }
    return progressTrackerInstance;
}

