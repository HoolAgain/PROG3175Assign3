const express = require('express');
const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');
const GreetingRequest = require('./models/GreetingRequest');
const GreetingResponse = require('./models/GreetingResponse');

const app = express();
const PORT = process.env.PORT || 8080;
const greetingsData = [
    ['Morning', 'English', 'Good morning!', 'Formal'],
    ['Afternoon', 'English', 'Good afternoon!', 'Formal'],
    ['Evening', 'English', 'Good evening!', 'Formal'],
    ['Morning', 'English', 'Mornin\'!', 'Casual'],
    ['Afternoon', 'English', 'Afternoon!', 'Casual'],
    ['Evening', 'English', 'Evenin\'!', 'Casual'],
    ['Morning', 'French', 'Bonjour!', 'Formal'],
    ['Afternoon', 'French', 'Bon après-midi!', 'Formal'],
    ['Evening', 'French', 'Bon soiree!', 'Formal'],
    ['Morning', 'French', 'Salut!', 'Casual'],
    ['Afternoon', 'French', 'Bon après.', 'Casual'],
    ['Evening', 'French', 'Ouais Demain', 'Casual'],
    ['Morning', 'Spanish', 'Buen dia!', 'Formal'],
    ['Afternoon', 'Spanish', 'Buenas tardes!', 'Formal'],
    ['Evening', 'Spanish', 'Buenas noches!', 'Formal'],
    ['Morning', 'Spanish', 'Manana!', 'Casual'],
    ['Afternoon', 'Spanish', 'La tarde.', 'Casual'],
    ['Evening', 'Spanish', 'Cya manana!', 'Casual']
];

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/home.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/about.html'));
});

// Open the SQLite database
let db;
(async () => {
    db = await sqlite.open({
        filename: './data/database.db',
        driver: sqlite3.Database
    });

    //here in case of fire, push the red button and reset table
    await db.exec('DROP TABLE IF EXISTS greetings');

    // Create a 'greetings' table if it doesn't exist
    await db.exec(`
    CREATE TABLE IF NOT EXISTS greetings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timeOfDay TEXT NOT NULL,
      language TEXT NOT NULL,
      greetingMessage TEXT,
      tone TEXT NOT NULL
    )
  `);

    // Seed the 'greetings' table
    const insertQuery = `
        INSERT INTO greetings (timeOfDay, language, greetingMessage, tone)
        VALUES (?, ?, ?, ?)`;

    for (const greeting of greetingsData) {
        await db.run(insertQuery, greeting);
    }
})();

// GET all timesOfDay
app.get('/api/GetAllTimesOfDay', async (req, res) => {
    try {
        const timesOfDay = await db.all('SELECT DISTINCT timeOfDay FROM greetings');
        res.json({ message: 'success', data: timesOfDay });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET all supported languages
app.get('/api/GetSupportedLanguages', async (req, res) => {
    try {
        const languages = await db.all('SELECT DISTINCT language FROM greetings');
        res.json({ message: 'success', data: languages });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST a new greeting
app.post('/Greet', async (req, res) => {
    try {
        const { timeOfDay, language, tone } = req.body;
        const greetingRequest = new GreetingRequest(timeOfDay, language, tone);

        const result = await db.get(`
            SELECT greetingMessage
            FROM greetings
            WHERE timeOfDay = ? AND language = ? AND tone = ?`,
            [greetingRequest.timeOfDay, greetingRequest.language, greetingRequest.tone]
        );

        if (!result) {
            res.status(404).json({
                greetingMessage: `No greeting found for ${greetingRequest.timeOfDay} in ${greetingRequest.language} with a ${greetingRequest.tone} tone`
            });
        } else {
            const greetingResponse = new GreetingResponse(result.greetingMessage);
            res.json(greetingResponse);
        }
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
