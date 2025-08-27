// Global test setup
import jest from 'jest';
process.env.NODE_ENV = 'test';

// Increase timeout for API tests
jest.setTimeout(30000);