const request = require("supertest");
const { expect } = require("chai");
const sinon = require("sinon");
const app = require('../../app');

const userService = require('../../../src/services/userService');

describe('User Controller', () => {
    describe('POST /users/register', () => {
        it('Ao informar dados válidos, deve retornar 201 Created', async () => {
            // Passo 1: Envio da requisição.
            const response = await request('http://localhost:3000/api')
                .post('/users/register')
                .send({
                    name: `UserTest ${numero}`,
                    email: email,
                    password: '123456'
                });

            // Passo 2: Verificação da resposta.
            expect(response.status).to.equal(201);
            expect(response.body.user).to.have.property('name', `UserTest ${numero}`);
            expect(response.body.user).to.have.property('email', email);
        });

        it('Ao informar um email já cadastrado, deve retornar 400 Bad Request', async () => {
            // Passo 1: Envio da requisição.
            const response = await request('http://localhost:3000/api')
                .post('/users/register')
                .send({
                    name: 'Alice',
                    email: 'alice@email.com',    
                    password: '123456'
                });

            // Passo 2: Verificação da resposta.
            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'Email já cadastrado');
        });
    });

    describe('POST /users/login', () => {
        it('Ao informar credenciais válidas, deve retornar 200.', async () => {
            // Passo 1: Envio da requisição.
            const response = await request('http://localhost:3000/api')
                .post('/users/login')
                .send({
                    email: 'alice@email.com',
                    password: '123456'
                });

            // Passo 2: Verificação da resposta.
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('token');
        });

        it('Usando Mock: Ao informar credenciais inválidas, deve retornar 401 Unauthorized.', async () => {
            // Mock para simular falha no serviço de autenticação.
            const userServiceMock = sinon.stub(userService, 'authenticate');
            userServiceMock.throws(new Error('Credenciais inválidas'));
            
            // Passo 1: Envio da requisição.
            const response = await request(app)
                .post('/users/login')
                .send({
                    email: 'alice@email.com',
                    password: '12345678'
                });

            // Passo 2: Verificação da resposta.
            expect(response.status).to.equal(401);
            expect(response.body).to.have.property('error', 'Credenciais inválidas');
        });
    });
});
