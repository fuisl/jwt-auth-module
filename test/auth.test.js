require('dotenv').config();
const express = require('express');
const request = require('supertest');
const { authRoutes, authenticateToken } = require('../index');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.get('/api/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Access granted', user: req.user });
});

describe('Auth Module Tests', () => {
    let token = '';

    // BEFORE ALL TESTS, REGISTER A TEST USER
    beforeAll(async () => {
        await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });
    });

    it('should login a user and return a token', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        token = res.body.token;
    });

    it('should access protected route with valid token', async () => {
        const res = await request(app)
            .get('/api/protected')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Access granted');
        expect(res.body.user).toHaveProperty('email', 'test@example.com');
    });

    it('should deny access to protected route without token', async () => {
        const res = await request(app)
            .get('/api/protected');

        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message', 'No token, authorization denied');
    });

    it('should deny access with invalid token', async () => {
        const res = await request(app)
            .get('/api/protected')
            .set('Authorization', 'Bearer invalidtoken123');

        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message', 'Token is not valid');
    });
});
