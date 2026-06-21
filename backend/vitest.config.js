import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./test/setup.js'],
    clearMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/app.js', 'src/middleware/**/*.js', 'src/routes/**/*.js'],
      exclude: ['src/index.js', 'src/prisma/**'],
    },
  },
});
