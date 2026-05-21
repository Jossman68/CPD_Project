import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

const mockAll = vi.fn();
const mockRun = vi.fn();

vi.mock('../database.js', () => ({
    default: {
        prepare: vi.fn(() => ({
            all: mockAll,
            run: mockRun,
        })),
    },
}));

import app from '../app.js';

beforeEach(() => {
    mockAll.mockReset();
    mockRun.mockReset();
});

describe('GET /api/repos (mocked)', () => {
    it('should return formatted repository data', async () => {
        mockAll.mockReturnValueOnce([
            {
                id: 1,
                name: 'test-repo',
                description: 'A test repository',
                language: 'JavaScript',
                stars: 5,
                forks: 2,
                updated_at: '2024-06-01T12:00:00Z',
                url: 'https://github.com/test/test-repo',
            },
        ]);

        const response = await request(app).get('/api/repos');

        expect(response.status).toBe(200);
        expect(response.body.repos).toHaveLength(1);
        expect(response.body.repos[0].name).toBe('test-repo');
        expect(response.body.repos[0].stars).toBe(5);
    });

    describe('GET /api/repos error handling', () => {
    it('should return 500 when GitHub API fails', async () => {
        mockAll.mockImplementationOnce(() => {
            throw new Error('GitHub is down');
        });

        const response = await request(app).get('/api/repos');

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error');
        });
    });
});

describe('GET /api/repos/languages (mocked)', () => {
    it('should return aggregated language byte counts', async () => {
        // First call: get list of repos
        mockAll.mockReturnValueOnce([
            { id: 1, name: 'JavaScript', bytes: 5000 },
            { id: 2, name: 'HTML', bytes: 2000 },
            { id: 3, name: 'CSS', bytes: 1000 },
        ]);

        const response = await request(app).get('/api/repos/languages');

        expect(response.status).toBe(200);
        expect(response.body.languages.JavaScript).toBe(5000);
        expect(response.body.languages.HTML).toBe(2000);
        expect(response.body.languages.CSS).toBe(1000);
    });

    it('should return 500 when language fetch fails', async () => {
        mockAll.mockImplementationOnce(() => {
            throw new Error('API error');
        });

        const response = await request(app).get('/api/repos/languages');

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error');
    });
});

describe('GET /api/repos/activity (mocked)', () => {
    it('should return recent activity events', async () => {
        mockAll.mockReturnValueOnce([
            { id: 1, type: 'PushEvent', repo: 'test/repo', created_at: '2025-05-01T10:00:00Z' },
            { id: 2, type: 'PullRequestEvent', repo: 'test/repo', created_at: '2025-05-01T09:00:00Z' },
        ]);

        const response = await request(app).get('/api/repos/activity');

        expect(response.status).toBe(200);
        expect(response.body.events).toHaveLength(2);
        expect(response.body.events[0].type).toBe('PushEvent');
        expect(response.body.events[0].repo).toBe('test/repo');
    });

    it('should return 500 when activity fetch fails', async () => {
        mockAll.mockImplementationOnce(() => {
            throw new Error('Network error');
        });

        const response = await request(app).get('/api/repos/activity');

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error');
    });
});

describe('GET /api/repos edge cases', () => {
    it('should return an empty array when GitHub has no repos', async () => {
        mockAll.mockReturnValueOnce([]);

        const response = await request(app).get('/api/repos');

        expect(response.status).toBe(200);
        expect(response.body.repos).toHaveLength(0);
        expect(Array.isArray(response.body.repos)).toBe(true);
    });
});

describe('GET /api/repos/languages edge cases', () => {
    it('should handle a repo with no languages', async () => {
        mockAll.mockReturnValueOnce([]);

        const response = await request(app).get('/api/repos/languages');

        expect(response.status).toBe(200);
        expect(Object.keys(response.body.languages)).toHaveLength(0);
    });
});