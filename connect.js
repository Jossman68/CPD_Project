import db from './database.js';
import axios from 'axios';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME;

const githubApi = axios.create({
    baseURL: 'https://api.github.com',
    headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
    },
});

export async function syncRepos() {
    try {
        const response = await githubApi.get(`/users/${GITHUB_USERNAME}/repos`);

        db.prepare(`DELETE FROM repos`).run();

        const insertRepo = db.prepare(`
            INSERT INTO repos (name, description, language, stars, forks, updated_at, url)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        for (const repo of response.data) {
            insertRepo.run(
                repo.name,
                repo.description,
                repo.language,
                repo.stargazers_count,
                repo.forks_count,
                repo.updated_at,
                repo.html_url
            );
        }
    
        console.log(`Synced ${response.data.length} repos`);

    } catch (error) {
        console.error("Error syncing repositories:", error);
    }
}

export async function syncLanguages() {
    try {
        const reposResponse = await githubApi.get(`/users/${GITHUB_USERNAME}/repos`);
        
        db.prepare(`DELETE FROM languages`).run();

        const insertLanguage = db.prepare(`
            INSERT INTO languages (name, bytes)
            VALUES (?, ?)
        `);
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

        for (const [language, count] of Object.entries(languageCounts)) {
            insertLanguage.run(language, count);
        }

        console.log(`Synced languages for ${reposResponse.data.length} repos`);
    } catch (error) {
        console.error("Error syncing languages:", error);
    }
}

export async function syncActivity() {
    try {
        const reposResponse = await githubApi.get(`/users/${GITHUB_USERNAME}/events`);

        db.prepare('DELETE FROM events').run();

        const insertEvent = db.prepare(`
            INSERT INTO events (type, repo, created_at)
            VALUES (?, ?, ?)
        `);

        for (const event of reposResponse.data) {
            insertEvent.run(
                event.type,
                event.repo.name,
                event.created_at
            );
        }
        console.log(`Synced ${reposResponse.data.length} events`);
    } catch (error) {
        console.error("Error syncing activity:", error);
    }
}

export async function syncAll() {
    await syncRepos();
    await syncLanguages();
    await syncActivity();
}