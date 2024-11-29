const express = require('express');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.static('public'));

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
});

(async () => {
    try {
        const client = await pool.connect();
        console.log('Connected to PostgreSQL');
        client.release();
    } catch (err) {
        console.error('Failed to connect to PostgreSQL:', err);
    }
})();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/home.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/about.html'));
});


app.get('/api/GetAllTimesOfDay', async (req, res) => {
    try {
        const { rows: timesOfDay } = await pool.query('SELECT DISTINCT timeOfDay FROM greetings');
        res.json({ message: 'success', data: timesOfDay });
    } catch (error) {
        console.error('Error fetching times of day:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/GetSupportedLanguages', async (req, res) => {
    try {
        const { rows: languages } = await pool.query('SELECT DISTINCT language FROM greetings');
        res.json({ message: 'success', data: languages });
    } catch (error) {
        console.error('Error fetching supported languages:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/Greet', async (req, res) => {
    try {
        const { timeOfDay, language, tone } = req.body;

        const { rows } = await pool.query(`
            SELECT greetingMessage
            FROM greetings
            WHERE timeOfDay = $1 AND language = $2 AND tone = $3
        `, [timeOfDay, language, tone]);

        if (rows.length === 0) {
            res.status(404).json({
                greetingMessage: `No greeting found for ${timeOfDay} in ${language} with a ${tone} tone`
            });
        } else {
            res.json({ greetingMessage: rows[0].greetingMessage });
        }
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}
