const { expect } = require("chai");
const request = require("supertest");
describe('User Controller', () => {
    describe('POST /users/register', () => {
        it('Ao informar dados válidos, deve retornar 201 Created', async () => {
            // Passo 1: Envio da requisição.
            const response = await request('http://localhost:3000/api')
                .post('/users/register')
                .send({
                    name: 'Lua',
                    email: 'lua@teste.com',
                    password: '123456'
                });

            // Passo 2: Verificação da resposta.
            expect(response.status).to.equal(201);
            expect(response.body.user).to.have.property('name', 'Lua');
            expect(response.body.user).to.have.property('email', 'lua@teste.com');
        });

        it('Ao informar um email já cadastrado, deve retornar 400 Bad Request', async () => {
            // Passo 1: Envio da requisição.
            const response = await request('http://localhost:3000/api')
                .post('/users/register')
                .send({
                    name: 'Lais',
                    email: 'lais@teste.com',    
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
                    email: 'lais@teste.com',
                    password: '123456'
                });

            // Passo 2: Verificação da resposta.
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('token');
        });

        it.only('Ao informar credenciais inválidas, deve retornar 401 Unauthorized.', async () => {
            // Passo 1: Envio da requisição.
            const response = await request('http://localhost:3000/api')
                .post('/users/login')
                .send({
                    email: 'lais@teste.com',
                    password: '12345678' // Senha incorreta
                });

            // Passo 2: Verificação da resposta.
            expect(response.status).to.equal(401);
            expect(response.body).to.have.property('error', 'Credenciais inválidas');
        });
    });
});
