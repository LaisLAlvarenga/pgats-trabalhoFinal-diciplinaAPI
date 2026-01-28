import http from 'k6/http';
import { group, check, sleep } from 'k6';
import { login } from '../helpers/auth.helper.js';
import { getRandomItem } from '../utils/faker.utils.js';
import checkoutData from '../data/checkout.data.json';
import { thresholds, checkoutDuration } from '../config/thresholds.js';

export const options = {
    stages: [
        { duration: '30s', target: 5 },
        { duration: '1m', target: 10 },
        { duration: '30s', target: 0 },
    ],
    thresholds
};

export default function () {
    const baseUrl = __ENV.BASE_URL;
    const email = __ENV.USER_EMAIL;
    const password = __ENV.USER_PASSWORD;

    let token;

    group('Login do usuário', () => {
        token = login(baseUrl, email, password);
    });

    group('Checkout', () => {
        const item = getRandomItem(checkoutData);

        const payload = JSON.stringify(item);

        const params = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        };

        const res = http.post(`${baseUrl}/api/checkout`, payload, params);

        checkoutDuration.add(res.timings.duration);

        check(res, {
            'checkout status 200': (r) => r.status === 200,
        });
    });

    sleep(1);
}