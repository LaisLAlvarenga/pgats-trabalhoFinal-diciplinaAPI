# 📄 Testes de Performance com K6

## 📁 Estrutura do Projeto

Os testes de performance estão organizados conforme a arquitetura abaixo, localizada no diretório `test/k6`:

```bash
test/
└── k6/
    ├── helpers/
    │   └── auth.helper.js
    ├── data/
    │   └── checkout.data.json
    ├── utils/
    │   └── faker.utils.js
    ├── config/
    │   └── thresholds.js
    └── tests/
        └── login-checkout.test.js
```

---

## ▶️ Execução do Teste

O teste é executado utilizando a ferramenta K6, com a configuração dos dados via **variáveis de ambiente**

---

## 🧠 Conceitos Aplicados

A seguir estão descritos todos os conceitos exigidos na disciplina, indicando **onde** e **como** cada um foi aplicado no código.

---

### 1️⃣ Variáveis de Ambiente

No arquivo `login-checkout.test.js`, as variáveis são acessadas por meio do objeto global `__ENV` do K6:

```js
const baseUrl = __ENV.BASE_URL;
const email = __ENV.USER_EMAIL;
const password = __ENV.USER_PASSWORD;
```

---

### 2️⃣ Groups

O conceito de **Groups** foi utilizado para organizar o teste em etapas lógicas, facilitando a leitura e a análise dos resultados.

No arquivo `test/k6/tests/login-checkout.test.js`, foram definidos dois grupos principais:

```js
group('Login do usuário', () => {
    token = login(baseUrl, email, password);
});

group('Checkout', () => {
    // execução do checkout
});
```

---

### 3️⃣ Helpers

Foi criado um **helper de autenticação** responsável pelo login do usuário.

O código abaixo está localizado no arquivo `test/k6/helpers/auth.helper.js`:

```js
export function login(baseUrl, email, password) {
    const res = http.post(`${baseUrl}/api/users/login`, payload, params);
    return res.json('token');
}
```

Esse helper é reutilizado no teste principal para obtenção do token de autenticação.

---

### 4️⃣ Uso de Token de Autenticação

Após o login, o token JWT retornado pela API é reutilizado nas requisições subsequentes, sendo enviado no header `Authorization`.

Exemplo presente no arquivo `login-checkout.test.js`:

```js
headers: {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`
}
```

---

### 5️⃣ Reaproveitamento de Resposta

O token de autenticação é extraído da resposta da requisição de login e armazenado em uma variável para reutilização durante o fluxo de teste:

```js
token = login(baseUrl, email, password);
```

Esse reaproveitamento evita múltiplos logins desnecessários e torna o teste mais eficiente.

---

### 6️⃣ Checks

Foram aplicados **checks** para validar se as requisições retornaram os resultados esperados.

Exemplo no helper de login (`auth.helper.js`):

```js
check(res, {
  'login status 200': (r) => r.status === 200,
  'token retornado': (r) => r.json('token') !== undefined,
});
```

Também são realizados checks no endpoint de checkout.

---

### 7️⃣ Thresholds

Os **thresholds** definem limites aceitáveis de desempenho e falha para o teste.

Eles estão configurados no arquivo `test/k6/config/thresholds.js`:

```js
export const thresholds = {
  http_req_failed: ['rate < 0.01'],
  http_req_duration: ['p(95) < 500'],
};
```

Esses thresholds garantem que o teste falhe caso os limites definidos sejam ultrapassados.

---

### 8️⃣ Trends

Foi criada uma métrica customizada do tipo **Trend** para medir o tempo de resposta específico da operação de checkout.

```js
export const checkoutDuration = new Trend('checkout_duration');
```

Essa métrica é alimentada durante a execução do teste e utilizada nos thresholds.

---

### 9️⃣ Stages

Os **stages** foram utilizados para simular a variação de carga de usuários ao longo do tempo.

No arquivo `login-checkout.test.js`:

```js
stages: [
  { duration: '30s', target: 5 },
  { duration: '1m', target: 10 },
  { duration: '30s', target: 0 },
]
```

Essa configuração simula ramp-up, pico e ramp-down de usuários virtuais.

---

### 🔟 Data-Driven Testing

O teste de checkout utiliza dados dinâmicos carregados de um arquivo JSON, localizado em `test/k6/data/checkout.data.json`:

```json
[
  { "productId": 1, "quantity": 1 },
  { "productId": 2, "quantity": 3 }
]
```

Durante a execução, um item é selecionado aleatoriamente, promovendo variação nos dados enviados à API.

---

### 1️⃣1️⃣ Faker / Geração de Dados Dinâmicos

Para simular dados variados, foi criada uma função utilitária responsável por selecionar dados aleatórios:

Arquivo: `test/k6/utils/faker.utils.js`

```js
export function getRandomItem(data) {
    const index = randomIntBetween(0, data.length - 1);
    return data[index];
}
```

---

## 📊 Relatório de Execução

Após a execução do teste, o relatório foi gerado em formato HTML utilizando o summary export do K6:

```bash
k6 run --summary-export=summary.json test/k6/tests/login-checkout.test.js
npx k6-html-reporter summary.json
```

O relatório HTML apresenta métricas de tempo de resposta, falhas, throughput e cumprimento dos thresholds definidos.