import 'dotenv/config';
import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.static('public'));

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME;

const githubApi = axios.create({
    baseURL: 'https://api.github.com',
    headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
    },
});

app.get("/api", (req, res) => {
    res.json({ message: "Welcome to the GitHub API Proxy Server!", 
                user: GITHUB_USERNAME });
});

app.get("/api/repos", async (req, res) => {
    try {
        const response = await githubApi.get(`/users/${GITHUB_USERNAME}/repos`);

        const repos = response.data.map(repo => ({
            name: repo.name,
            description: repo.description,
            language: repo.language,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            updated_at: repo.updated_at,
            url: repo.html_url,
        }));

        res.json({ repos });
    } catch (error) {
        console.error("Error fetching repositories:", error);
        res.status(500).json({ error: "Failed to fetch repositories" });
    }
});

app.get("/api/repos/languages", async (req, res) => {
    try {
        const reposResponse = await githubApi.get(`/users/${GITHUB_USERNAME}/repos`);
        const languageCounts = {};

        for (const repo of reposResponse.data) {
            const languagesResponse = await githubApi.get(`/repos/${GITHUB_USERNAME}/${repo.name}/languages`);

            for (const [language, count] of Object.entries(languagesResponse.data)) {
                if (languageCounts[language] !== undefined) {
                    languageCounts[language] += count;
                } else {
                    languageCounts[language] = count;
                }
            }
        }

        res.json({ languages: languageCounts });
    } catch (error) {
        console.error("Error fetching repository languages:", error.message);
        res.status(500).json({ error: "Failed to fetch repository languages" });
    }
});

app.get("/api/repos/activity", async (req, res) => {
    try {
        const reposResponse = await githubApi.get(`/users/${GITHUB_USERNAME}/events`);

        const events = reposResponse.data.map(event => ({
            type: event.type,
            repo: event.repo.name,
            created_at: event.created_at,
        }));

        res.json({ events });

    } catch (error) {
        console.error("Error fetching repository activity:", error.message);
        res.status(500).json({ error: "Failed to fetch repository activity" });
    }
});

export default app;