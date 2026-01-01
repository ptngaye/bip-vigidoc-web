import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const SRC_DIR = path.resolve(__dirname, '../../');

type Layer = 'domain' | 'application' | 'adapters' | 'infrastructure' | 'ui' | 'app';

const LAYER_RULES: Record<Layer, Layer[]> = {
  domain: [],
  application: ['domain'],
  adapters: ['domain', 'application'],
  infrastructure: ['domain', 'application', 'adapters'],
  ui: ['domain', 'application', 'infrastructure'],
  app: ['ui', 'infrastructure'],
};

const LAYER_ALIASES: Record<string, Layer> = {
  '@domain': 'domain',
  '@application': 'application',
  '@adapters': 'adapters',
  '@infrastructure': 'infrastructure',
  '@ui': 'ui',
};

function getAllFiles(dir: string, extensions: string[]): string[] {
  const files: string[] = [];
  if (!fs.existsSync(dir)) return files;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== '__tests__' && entry.name !== 'test') {
      files.push(...getAllFiles(fullPath, extensions));
    } else if (extensions.some(ext => entry.name.endsWith(ext)) && !entry.name.includes('.test.')) {
      files.push(fullPath);
    }
  }
  return files;
}

function extractImports(filePath: string): string[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const importRegex = /import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+)?['"]([^'"]+)['"]/g;
  const imports: string[] = [];
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  return imports;
}

function getLayerFromImport(importPath: string): Layer | null {
  for (const [alias, layer] of Object.entries(LAYER_ALIASES)) {
    if (importPath.startsWith(alias)) return layer;
  }
  return null;
}

function getLayerFromFilePath(filePath: string): Layer | null {
  const relativePath = path.relative(SRC_DIR, filePath);
  const firstDir = relativePath.split(path.sep)[0];
  return firstDir in LAYER_RULES ? (firstDir as Layer) : null;
}

interface Violation {
  file: string;
  sourceLayer: Layer;
  importPath: string;
  targetLayer: Layer;
}

function findAllViolations(): Violation[] {
  const violations: Violation[] = [];
  const layers: Layer[] = ['domain', 'application', 'adapters', 'infrastructure', 'ui', 'app'];

  for (const layer of layers) {
    const layerDir = path.join(SRC_DIR, layer);
    const files = getAllFiles(layerDir, ['.ts', '.tsx']);

    for (const file of files) {
      const imports = extractImports(file);
      const allowedLayers = LAYER_RULES[layer];

      for (const imp of imports) {
        const targetLayer = getLayerFromImport(imp);
        if (targetLayer && targetLayer !== layer && !allowedLayers.includes(targetLayer)) {
          violations.push({
            file: path.relative(SRC_DIR, file),
            sourceLayer: layer,
            importPath: imp,
            targetLayer,
          });
        }
      }
    }
  }

  return violations;
}

describe('Architecture hexagonale', () => {
  it('respecte les règles de dépendances entre couches', () => {
    const violations = findAllViolations();

    if (violations.length > 0) {
      const message = violations
        .map(v => `  ${v.file}: ${v.sourceLayer} → ${v.targetLayer} (import '${v.importPath}')`)
        .join('\n');

      expect.fail(
        `${violations.length} violation(s) des règles d'architecture:\n${message}\n\n` +
          'Règles:\n' +
          '  domain → (rien)\n' +
          '  application → domain\n' +
          '  adapters → domain, application\n' +
          '  infrastructure → domain, application, adapters\n' +
          '  ui → domain, application, infrastructure\n' +
          '  app → ui, infrastructure'
      );
    }
  });
});
