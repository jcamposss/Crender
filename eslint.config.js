import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

const workspacePackages = '@crender/*';

// Enforces the hexagonal dependency direction (docs/adr/0004): each layer lists what it may
// import; everything else under the workspace scope is rejected.
function onlyAllow(allowedPackages, message) {
  return {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: [workspacePackages, ...allowedPackages.map((name) => `!${name}`)],
            message,
          },
        ],
      },
    ],
  };
}

export default defineConfig(
  {
    ignores: ['**/node_modules/', '**/dist/', 'apps/sketchup-extension/'],
  },
  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: { allowDefaultProject: ['*.config.ts', '*.config.js'] },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.js'],
    extends: [tseslint.configs.disableTypeChecked],
  },
  {
    files: ['packages/domain/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: [workspacePackages], message: 'domain must not depend on other packages.' },
            { group: ['node:*'], message: 'domain is pure: no runtime or I/O modules.' },
          ],
        },
      ],
    },
  },
  {
    files: ['packages/application/**', 'packages/prompt-builder/**', 'packages/contracts/**'],
    rules: onlyAllow(['@crender/domain'], 'this package may only depend on @crender/domain.'),
  },
  {
    files: ['packages/infrastructure/**'],
    rules: onlyAllow(
      ['@crender/domain', '@crender/application', '@crender/contracts'],
      'infrastructure may depend on domain, application and contracts only.',
    ),
  },
  {
    files: ['apps/plugin-ui/**'],
    rules: onlyAllow(
      ['@crender/domain', '@crender/contracts', '@crender/prompt-builder'],
      'plugin-ui runs on the customer machine: no application or infrastructure code (provider keys live there).',
    ),
  },
);
