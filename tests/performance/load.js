import browse, { positiveNumber, readiness } from './lib/workload.js';

const vus = positiveNumber('VUS', 10);
export const options = {
  tags: { test_type: 'load', run_id: __ENV.RUN_ID || 'local' },
  scenarios: {
    load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: __ENV.RAMP_DURATION || '30s', target: vus },
        { duration: __ENV.HOLD_DURATION || '2m', target: vus },
        { duration: __ENV.RAMP_DURATION || '30s', target: 0 },
      ],
      gracefulRampDown: '15s',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: [`p(95)<${positiveNumber('P95_MS', 500)}`],
    checks: ['rate>0.99'],
  },
};

export const setup = readiness;
export default browse;
