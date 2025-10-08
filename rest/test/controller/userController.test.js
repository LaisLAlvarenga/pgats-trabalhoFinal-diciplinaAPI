const request = require("supertest");
const sinon = require("sinon");
const { expect } = require("chai");

const app = require('../../../rest/app');
const userService = require('../../../src/services/userService');

describe('User Controller', () => {
    describe('POST /users/register', () => {
        beforeEach(async () => {
            // Obter token.
            const loginResponse = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'alice@email.com',
                    password: '123456'
                });
            token = loginResponse.body.token;
        });

        it('Usando mock: Ao informar dados válidos, deve retornar 201 Created', async () => {
            // Mock para simular registro de usuário.
            const userServiceMock = sinon.stub(userService, 'registerUser');
            userServiceMock.returns({
                id: 1,
                name: 'User Test',
                email: 'email@teste.com'
            });

            // Passo 1: Envio da requisição.
            const response = await request(app)
                .post('/api/users/register')
                .send({
                    name: `UserTest22`,
                    email: 'teste@teste.com',
                    password: '123456'
                });

            // Passo 2: Verificação da resposta.
            expect(response.status).to.equal(201);
        });

        /* it('Usando mock: Ao informar um email já cadastrado, deve retornar 400 Bad Request', async () => {
             // Mock para simular registro de usuário.
            const userServiceMock = sinon.stub(userService, 'registerUser');
            userServiceMock.throws(new Error('Email já cadastrado'));
            
            // Passo 1: Envio da requisição.
            const response = await request(app)
                .post('/api/users/register')
                .send({
                    name: 'Teste',
                    email: 'teste@email.com',    
                    password: '123456'
                });
            console.log(response.statusCode);

            // Passo 2: Verificação da resposta.
            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'Email já cadastrado');
        }); */
    });

    describe('POST /users/login', () => {
        it('Usando Mock: Ao informar credenciais válidas, deve retornar 200.', async () => {
            // Mock para simular autenticação.
            const userServiceMock = sinon.stub(userService, 'authenticate');
            userServiceMock.returns({
                token: 'mocked-jwt-token'
            });
            
            // Passo 1: Envio da requisição.
            const response = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'alice@email.com',
                    password: '123456'
                });
            console.log(response.statusCode);
            // Passo 2: Verificação da resposta.
            expect(response.status).to.equal(200);
            //expect(response.body).to.have.property('token');
        });

        /* it('Usando Mock: Ao informar credenciais inválidas, deve retornar 401 Unauthorized.', async () => {
            // Mock para simular falha no serviço de autenticação.
            const userServiceMock = sinon.stub(userService, 'authenticate');
            userServiceMock.throws(new Error('Credenciais inválidas'));
            
            // Passo 1: Envio da requisição.
            const response = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'alice@email.com',
                    password: '12345678'
                });
            console.log(response.statusCode);

            // Passo 2: Verificação da resposta.
            expect(response.statusCode).to.equal(401);
            expect(response.body).to.have.property('error', 'Credenciais inválidas');
        }); */
    });
});
