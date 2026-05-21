import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

const { mockGet } = vi.hoisted(() => {
    const mockGet = vi.fn();
    return { mockGet };
});

vi.mock('axios', () => ({
    default: {
        create: vi.fn(() => ({
            get: mockGet,
        })),
    },
}));

import app from '../app.js';

beforeEach(() => {
    mockGet.mockReset();
});

describe('GET /api/repos (mocked)', () => {
    it('should return formatted repository data', async () => {
        mockGet.mockResolvedValueOnce({
            data: [
                {
                    name: 'test-repo',
                    description: 'A test repository',
                    language: 'JavaScript',
                    stargazers_count: 5,
                    forks_count: 2,
                    updated_at: '2025-01-01T00:00:00Z',
                    html_url: 'https://github.com/test/test-repo',
                },
            ],
        });

        const response = await request(app).get('/api/repos');

        expect(response.status).toBe(200);
        expect(response.body.repos).toHaveLength(1);
        expect(response.body.repos[0].name).toBe('test-repo');
        expect(response.body.repos[0].stars).toBe(5);
    });

    describe('GET /api/repos error handling', () => {
    it('should return 500 when GitHub API fails', async () => {
        mockGet.mockRejectedValueOnce(new Error('GitHub is down'));

        const response = await request(app).get('/api/repos');

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error');
        });
    });
});

describe('GET /api/repos/languages (mocked)', () => {
    it('should return aggregated language byte counts', async () => {
        // First call: get list of repos
        mockGet.mockResolvedValueOnce({
            data: [
                { name: 'repo-one' },
                { name: 'repo-two' },
            ],
        });

        // Second call: languages for repo-one
        mockGet.mockResolvedValueOnce({
            data: { JavaScript: 5000, HTML: 2000 },
        });

        // Third call: languages for repo-two
        mockGet.mockResolvedValueOnce({
            data: { JavaScript: 3000, CSS: 1000 },
        });

        const response = await request(app).get('/api/repos/languages');

        expect(response.status).toBe(200);
        expect(response.body.languages.JavaScript).toBe(8000);
        expect(response.body.languages.HTML).toBe(2000);
        expect(response.body.languages.CSS).toBe(1000);
    });

    it('should return 500 when language fetch fails', async () => {
        mockGet.mockRejectedValueOnce(new Error('API error'));

        const response = await request(app).get('/api/repos/languages');

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error');
    });
});

describe('GET /api/repos/activity (mocked)', () => {
    it('should return recent activity events', async () => {
        mockGet.mockResolvedValueOnce({
            data: [
                { type: 'PushEvent', repo: { name: 'test/repo' } },
                { type: 'PullRequestEvent', repo: { name: 'test/repo' } },
            ],
        });

        const response = await request(app).get('/api/repos/activity');
        expect(response.status).toBe(200);
        expect(response.body.events).toHaveLength(2);
        expect(response.body.events[0].type).toBe('PushEvent');
        expect(response.body.events[0].repo).toBe('test/repo');
    });

    it('should return 500 when activity fetch fails', async () => {
        mockGet.mockRejectedValueOnce(new Error('Network error'));

        const response = await request(app).get('/api/repos/activity');

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error');
    });
});

describe('GET /api/repos edge cases', () => {
    it('should return an empty array when GitHub has no repos', async () => {
        mockGet.mockResolvedValueOnce({
            data: [],
        });

        const response = await request(app).get('/api/repos');

        expect(response.status).toBe(200);
        expect(response.body.repos).toHaveLength(0);
        expect(Array.isArray(response.body.repos)).toBe(true);
    });
});

describe('GET /api/repos/languages edge cases', () => {
    it('should handle a repo with no languages', async () => {
        mockGet.mockResolvedValueOnce({
            data: [{ name: 'empty-repo' }],
        });

        mockGet.mockResolvedValueOnce({
            data: {},
        });

        const response = await request(app).get('/api/repos/languages');

        expect(response.status).toBe(200);
        expect(Object.keys(response.body.languages)).toHaveLength(0);
    });
});