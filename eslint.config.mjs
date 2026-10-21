import next from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

/**
 * Lint config.
 *
 * There was no ESLint config at all before this, so `npm run lint` printed a
 * migration guide and exited non-zero — which meant it could never have been
 * part of the loop. Now it runs, and it is part of `npm run check`.
 */
const config = [
  // Build output and dependencies are not ours to lint.
  { ignores: ['.next/**', 'node_modules/**', '.data/**', 'next-env.d.ts'] },
  ...next,
  ...nextTs,
  {
    rules: {
      // Unused variables are worth catching. Dead constants left behind after a
      // refactor are exactly what confuses the next person reading the file.
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // `any` creeps in through JSON.parse boundaries. Where it is genuinely
      // needed, `unknown` plus a narrowing step says the same thing safely.
      '@typescript-eslint/no-explicit-any': 'warn',

      // Fetching on mount into client state is the correct shape for these
      // screens: they read admin-scoped data that has to be fetched after the
      // session cookie is known, so it cannot be a server component. Kept as a
      // warning rather than an error so the real instances stay visible in
      // review instead of being silenced wholesale.
      'react-hooks/set-state-in-effect': 'warn',

      // Fires on `const Icon = service.icon; <Icon />`, where a component comes
      // out of data rather than a literal. That is a valid pattern and the rule
      // cannot tell it apart from defining a component inside render, which is
      // what it is actually trying to catch.
      'react-hooks/static-components': 'off',
    },
  },
];

export default config;