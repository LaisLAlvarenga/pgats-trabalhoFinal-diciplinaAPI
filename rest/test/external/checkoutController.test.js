const request = require('supertest');
const {expect} = require('chai');

describe('Checkout Controller', () => {
    describe('POST /checkout', () => {
        let token = null;

        beforeEach(async () => {
            // Obter token.
            const loginResponse = await request('http://localhost:3000/api')
                .post('/users/login')
                .send({
                    email: 'alice@email.com',
                    password: '123456'
                });
            token = loginResponse.body.token;
        });

        it('Ao informar algo inválido no checkout, deve retornar 400 Bad Request.', async () => {
            // Envio da requisição.
            const response = await request('http://localhost:3000/api')
                .post('/checkout')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "items": [
                        {
                            "productId": 0,
                            "quantity": 0
                        }
                    ],
                    "freight": 0,
                    "paymentMethod": "boleto",
                    "cardData": {
                        "number": "string",
                        "name": "string",
                        "expiry": "string",
                        "cvv": "string"
                    }
                });

            // Verificação da resposta.
            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'Produto não encontrado');
        });

        it('Ao informar token inválido no checkout, deve retornar 401 Unauthorized.', async () => {    
            // Envio da requisição.
            const response = await request('http://localhost:3000/api')
                .post('/checkout')
                .set('Authorization', `Bearer 147741`)
                .send({
                    "items": [{"productId":1,"quantity":2}],
                    "freight": 20,
                    "paymentMethod": "boleto"
                });
                
            // Verificação da resposta.
            expect(response.status).to.equal(401);
            expect(response.body).to.have.property('error', 'Token inválido');
        })

        it('Realizar checkout válido com o método Boleto, deve retornar 200.', async () => {
            // Envio da requisição.
            const response = await request('http://localhost:3000/api')
                .post('/checkout')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "items": [{
                        "productId":1,
                        "quantity":2
                    }],
                    "freight": 20,
                    "paymentMethod": "boleto"
                });

            // Verificação da resposta.
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('paymentMethod', 'boleto');
        });

        it('Realizar checkout válido com o método Cartão, deve retornar 200.', async () => {
            // Envio da requisição.
            const response = await request('http://localhost:3000/api')
                .post('/checkout')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "items": [{
                        "productId":1,
                        "quantity":2
                    }],
                    "freight": 20,
                    "paymentMethod": "credit_card",
                    "cardData": {
                        "number": "1234567890123456",
                        "name": "Lais",
                        "expiry": "12/30",
                        "cvv": "123"
                    }
                });

            // Verificação da resposta.
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('paymentMethod', 'credit_card');
        });
    });
});