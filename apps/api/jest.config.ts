import type { Config } from 'jest'

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/*.spec.(t|j)s',
    '!**/*.module.(t|j)s',
    '!**/*.controller.(t|j)s',
    '!**/*.dto.(t|j)s',
    '!**/*.decorator.(t|j)s',
    '!**/*.guard.(t|j)s',
    '!**/*.filter.(t|j)s',
    '!**/*.interceptor.(t|j)s',
    '!**/index.(t|j)s',
    '!**/main.(t|j)s',
    '!**/*.config.(t|j)s',
    '!**/prisma/**',
    '!**/processors/**',
    '!**/*.gateway.(t|j)s',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: { '@/(.*)': '<rootDir>/$1' },
  coverageThreshold: {
    global: { branches: 50, functions: 60, lines: 60 },
  },
}

export default config
