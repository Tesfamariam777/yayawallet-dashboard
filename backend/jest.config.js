export default {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testMatch: ['**/__tests__/**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/testSetup.js'],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  transform: {},
  // extensionsToTreatAsEsm: ['.js'],
  // moduleNameMapping: {
  //   '^(\\.{1,2}/.*)\\.js$': '$1'
  // }
};