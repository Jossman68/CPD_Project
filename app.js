import 'dotenv/config';
import express from 'express';
import db from './database.js';

const app = express();
app.use(express.static('public'));

const GITHUB_USERNAME = process.env.GITHUB_USERNAME;

app.get("/api", (req, res) => {
    res.json({ message: "Welcome to the GitHub API Proxy Server!", 
                user: GITHUB_USERNAME });
});

app.get("/api/repos", async (req, res) => {
    try {
        const repos = db.prepare(`SELECT * FROM repos ORDER BY updated_at DESC`).all();
        res.json({ repos });
    } catch (error) {
        console.error("Error fetching repositories:", error);
        res.status(500).json({ error: "Failed to fetch repositories" });
    }
});

app.get("/api/repos/languages", async (req, res) => {
    try {
        const languages = db.prepare(`SELECT * FROM languages`).all();
        const languageCounts = {};
        for (const lang of languages) {
            languageCounts[lang.name] = lang.bytes;
        }
        res.json({ languages: languageCounts });
    } catch (error) {
        console.error("Error fetching repository languages:", error.message);
        res.status(500).json({ error: "Failed to fetch repository languages" });
    }
});

app.get("/api/repos/activity", async (req, res) => {
    try {
        const rows = db.prepare('SELECT * FROM events ORDER BY created_at DESC LIMIT 10').all();
        res.json({ events: rows });

    } catch (error) {
        console.error("Error fetching repository activity:", error.message);
        res.status(500).json({ error: "Failed to fetch repository activity" });
    }
});

export default app;