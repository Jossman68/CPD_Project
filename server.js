import 'dotenv/config';
import express from 'express';
import axios from 'axios';

const PORT = process.env.PORT || 8000;
const app = express();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME;

const githubApi = axios.create({
    baseURL: 'https://api.github.com',
    headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
    },
});

app.get("/", (req, res) => {
    res.json({ message: "Welcome to the GitHub API Proxy Server!", 
                user: GITHUB_USERNAME });
});


app.get("/repos", async (req, res) => {
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
