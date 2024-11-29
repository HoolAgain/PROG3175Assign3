class GreetingRequest {
    constructor(timeOfDay, language, tone) {
        this.timeOfDay = timeOfDay;
        this.language = language;
        this.tone = tone;
    }
}

module.exports = GreetingRequest;