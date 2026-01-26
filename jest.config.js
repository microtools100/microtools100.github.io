module.exports = {
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    'public/assets/js/**/*.js',
    '!public/assets/js/**/*.test.js',
    '!public/assets/js/core.js'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/public/tools/'
  ],
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testTimeout: 5000,
  verbose: true,
  bail: 1,
  coverageThresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
