// setupTests.ts
import '@testing-library/jest-dom';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './tests/mocks/server';
import { cleanup } from '@testing-library/react';

// start MSW
beforeAll(() => server.listen());

afterEach(() => {
  server.resetHandlers();
  cleanup(); // clean DOM between tests
});

afterAll(() => server.close());
