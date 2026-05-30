import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    // Foco somente nas pastas testáveis por unidade
    'src/lib/**/*.{ts,tsx}',
    'src/shared/lib/**/*.{ts,tsx}',
    'src/shared/stores/**/*.{ts,tsx}',
    'src/shared/ui/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    // Excluir componentes complexos (streaming/editor/carrossel)
    '!src/shared/ui/article-ai-chat.tsx',
    '!src/shared/ui/news-carousel.tsx',
    '!src/shared/ui/rich-text-editor.tsx',
    // Excluir infraestrutura de API client
    '!src/shared/lib/api.ts',
  ],
  coverageThreshold: {
    global: { branches: 60, functions: 60, lines: 60 },
  },
}

export default createJestConfig(config)
