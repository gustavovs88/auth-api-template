/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  roots: ['<rootDir>/src'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  setupFilesAfterEnv: ['<rootDir>/src/jest.setup.ts'],
  moduleNameMapper: {
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@logger/(.*)$': '<rootDir>/src/logger/$1',
    '^@di/(.*)$': '<rootDir>/src/di/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@presentation/(.*)$': '<rootDir>/src/presentation/$1',
    '^@application/(.*)$': '<rootDir>/src/application/$1',
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@tests/(.*)$': '<rootDir>/src/tests/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@docs/(.*)$': '<rootDir>/src/docs/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
  },
}
