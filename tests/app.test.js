import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../app.js';

describe('GET /api', () => {
    it("should return a welcome message", async () => {
        const response = await request(app).get('/api');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');
    });
});

describe('GET /api/repos', () => {

    it('should return a list of repositories', async () => {
        const response = await request(app).get('/api/repos');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('repos');
        expect(Array.isArray(response.body.repos)).toBe(true);
    });

});