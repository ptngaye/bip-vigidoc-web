import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/test/**',
        'src/app/**',
        'src/infrastructure/**',
        // Composants UI de présentation statique (pas de logique)
        'src/ui/components/Header.tsx',
        'src/ui/components/Footer.tsx',
        'src/ui/components/Hero.tsx',
        'src/ui/components/HowItWorks.tsx',
        'src/ui/components/AcceptedDocuments.tsx',
        // Value Objects triviaux (enums/constantes)
        'src/domain/value-objects/Verdict.ts',
        'src/domain/value-objects/TrustLevel.ts',
        'src/domain/value-objects/DetectedDocumentType.ts',
        'src/domain/value-objects/DocumentFamily.ts',
        'src/domain/value-objects/FailureCode.ts',
        'src/**/*.d.ts',
        'src/**/index.ts',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@domain': path.resolve(__dirname, './src/domain'),
      '@application': path.resolve(__dirname, './src/application'),
      '@adapters': path.resolve(__dirname, './src/adapters'),
      '@infrastructure': path.resolve(__dirname, './src/infrastructure'),
      '@ui': path.resolve(__dirname, './src/ui'),
    },
  },
});
