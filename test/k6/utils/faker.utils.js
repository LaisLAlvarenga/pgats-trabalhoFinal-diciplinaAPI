import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

export function getRandomItem(data) {
    const index = randomIntBetween(0, data.length - 1);
    return data[index];
}