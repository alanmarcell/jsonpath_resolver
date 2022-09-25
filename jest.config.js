const merge = require('merge')
const tsJest = require('ts-jest/jest-preset')

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = merge.recursive(
  tsJest,
  {
    testEnvironment: 'node',
    collectCoverage: true,
    coverageDirectory: 'coverage',
    testPathIgnorePatterns: [
      "/node_modules/",
      "/dist"
    ],
    moduleNameMapper: {
      '^@src(.*)$': '<rootDir>/src$1',
    },
  })
