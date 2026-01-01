# CLAUDE.md — BIP VigiDoc Web

> Ce fichier complète les règles globales définies dans `/Users/ptn/dev/projects/CLAUDE.md`

## Contexte

Application web de vérification de documents (KYD - Know Your Document).
- **Stack** : Next.js 14, TypeScript 5.4, Tailwind CSS, Vitest
- **Architecture** : Hexagonale stricte (dogmatique)

---

## Architecture Hexagonale Frontend

### Décision architecturale

L'architecture hexagonale est appliquée de manière **dogmatique** sur ce projet frontend. Cette décision est assumée et ne doit pas être remise en question.

### Structure des couches

```
src/
├── domain/           # Coeur métier pur (aucune dépendance)
│   ├── entities/     # Entités métier
│   ├── value-objects/# Value Objects immuables
│   └── errors/       # Erreurs métier typées
│
├── application/      # Cas d'usage et orchestration
│   ├── use-cases/    # Cas d'usage (un fichier = un use-case)
│   ├── ports/        # Interfaces (contrats avec l'extérieur)
│   └── errors/       # Erreurs applicatives
│
├── adapters/         # Implémentations des ports
│   └── api/          # Adaptateurs HTTP (fetch, axios...)
│       └── mappers/  # Transformation DTO <-> Domain
│
├── infrastructure/   # Bootstrap et configuration
│   ├── config/       # Configuration (env, constantes)
│   └── di/           # Injection de dépendances
│
├── ui/               # Couche présentation React
│   ├── components/   # Composants React
│   └── hooks/        # Hooks personnalisés
│
├── app/              # Next.js App Router (assemblage uniquement)
│
└── test/             # Tests transverses (architecture, helpers)
```

### Règles de dépendances (STRICTES)

| Couche | Peut importer | NE PEUT PAS importer |
|--------|---------------|----------------------|
| `domain/` | Rien | application, adapters, infrastructure, ui, app |
| `application/` | domain | adapters, infrastructure, ui, app |
| `adapters/` | domain, application | infrastructure, ui, app |
| `infrastructure/` | domain, application, adapters | ui, app |
| `ui/` | domain, application, infrastructure | adapters, app |
| `app/` | **ui, infrastructure uniquement** | domain, application, adapters |
| `test/` | Tout | - |

**Règle d'or** : Les imports vont toujours vers l'intérieur (domain), jamais vers l'extérieur.

**Règle app/** : Les pages Next.js (`app/`) sont des **shells d'assemblage**. Elles importent des composants UI et la configuration infrastructure. Toute logique métier doit passer par les hooks/composants de `ui/`.

---

## Tests d'architecture

### Double validation

Les règles de dépendances sont validées par :
1. **ESLint** avec `eslint-plugin-boundaries` (temps réel)
2. **Vitest** avec `src/test/architecture/architecture.test.ts` (CI)

### Commandes

```bash
npm run lint        # Validation ESLint (inclut boundaries)
npm run test:arch   # Tests d'architecture Vitest
```

---

## Qualité du code

### Coverage de tests

| Métrique | Minimum requis |
|----------|----------------|
| Lines | 80% |
| Functions | 80% |
| Branches | 80% |
| Statements | 80% |

**Exclusions du coverage** (justifiées) :
- `src/app/` — Pages Next.js = shells d'assemblage (E2E)
- `src/infrastructure/` — Configuration et DI
- `src/ui/components/{Header,Footer,Hero,HowItWorks,AcceptedDocuments}.tsx` — Présentation statique
- `src/domain/value-objects/{Verdict,TrustLevel,DetectedDocumentType,DocumentFamily,FailureCode}.ts` — Enums/constantes
- `src/test/`, `**/index.ts` — Helpers et réexports

Configuration dans `vitest.config.ts`.

### TypeScript

- Mode `strict: true` obligatoire
- Pas de `any` explicite (utiliser `unknown` si nécessaire)
- Pas de `@ts-ignore` ou `@ts-expect-error` sans justification
- Tous les paramètres de fonction typés explicitement
- Types de retour explicites pour les fonctions publiques

### ESLint + Prettier

Prettier est intégré à ESLint via `eslint-plugin-prettier`. Les erreurs de formatage sont des erreurs ESLint.

```bash
npm run lint        # Vérifie code + format
npm run lint:fix    # Corrige automatiquement
npm run format      # Formate avec Prettier
npm run format:check # Vérifie le formatage
```

Lint obligatoire avant chaque build (`npm run build` exécute `lint` puis `next build`).

---

## Conventions de code

### Nommage

| Élément | Convention | Exemple |
|---------|------------|---------|
| Fichiers composants | PascalCase | `DocumentDropZone.tsx` |
| Fichiers autres | PascalCase | `VerifyDocument.ts` |
| Interfaces/Types | PascalCase, préfixe explicite | `DocumentVerifierGateway` |
| Value Objects | PascalCase | `FileSize`, `ContentType` |
| Hooks | camelCase, préfixe `use` | `useDocumentUpload` |
| Tests | `*.test.ts(x)` | `FileSize.test.ts` |

### Structure des fichiers

```typescript
// 1. Imports (groupés et ordonnés)
import { ... } from '@domain/...';      // Domain first
import { ... } from '@application/...'; // Then application
import { ... } from '@ui/...';          // Then UI
import { ... } from 'external-lib';     // External last

// 2. Types/Interfaces locaux

// 3. Constantes

// 4. Code principal (classe, fonction, composant)

// 5. Exports
```

### Tests

| Couche | Type de test | Localisation | Peut importer |
|--------|--------------|--------------|---------------|
| `domain/` | Unit | `__tests__/` dans le dossier | domain uniquement |
| `application/` | Unit avec fakes | `__tests__/` dans le dossier | domain, application |
| `adapters/` | Integration | `__tests__/` dans le dossier | domain, application, adapters |
| `ui/` | Unit + RTL | `__tests__/` dans le dossier | Tout sauf app |
| `test/` | Architecture | `src/test/architecture/` | Tout |

---

## Scripts NPM

```bash
npm run dev          # Serveur de développement
npm run build        # Lint + Build production
npm run lint         # ESLint (inclut Prettier + Boundaries)
npm run lint:fix     # ESLint avec auto-fix
npm run format       # Prettier write
npm run format:check # Prettier check
npm run test         # Vitest watch
npm run test:coverage # Vitest avec coverage
npm run test:arch    # Tests d'architecture uniquement
npm run check        # Lint + Format + Coverage (CI)
```

---

## Checklist avant commit

- [ ] `npm run lint` passe sans erreur
- [ ] `npm run format:check` passe sans erreur
- [ ] `npm run test:coverage` passe avec coverage >= 80%
- [ ] `npm run test:arch` passe
- [ ] Pas de `console.log` oublié
- [ ] Pas de `any` non justifié
- [ ] Imports respectent les règles de dépendances
