import browse, { positiveNumber, readiness } from './lib/workload.js';

const peak = positiveNumber('MAX_VUS', 100);
export const options = {
  tags: { test_type: 'stress', run_id: __ENV.RUN_ID || 'local' },
  scenarios: {
    stress: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: __ENV.STEP_DURATION || '1m', target: Math.max(1, Math.floor(peak * 0.1)) },
        { duration: __ENV.STEP_DURATION || '1m', target: Math.max(1, Math.floor(peak * 0.5)) },
        { duration: __ENV.STEP_DURATION || '1m', target: peak },
        { duration: __ENV.HOLD_DURATION || '2m', target: peak },
        { duration: __ENV.RECOVERY_DURATION || '1m', target: 0 },
      ],
      gracefulRampDown: '15s',
    },
  },
  thresholds: {
    http_req_failed: [{ threshold: 'rate<0.05', abortOnFail: true, delayAbortEval: '30s' }],
    http_req_duration: [`p(95)<${positiveNumber('P95_MS', 1500)}`],
    checks: ['rate>0.95'],
  },
};

export const setup = readiness;
export default browse;
