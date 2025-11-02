import request from "supertest";
import app from "../../src/app";

describe('Mission Routes - GET /missions', () => {
    it('should return all missions with status 200', async () => {
        const response = await request(app).get('/api/missions');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});