import { Trend } from 'k6/metrics';

export const checkoutDuration = new Trend('checkout_duration');

export const thresholds = {
    http_req_failed: ['rate < 0.01'],
    http_req_duration: ['p(95) < 500'],
    checkout_duration: ['p(95) < 400'],
};