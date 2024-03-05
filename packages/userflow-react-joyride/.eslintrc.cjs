module.exports = {
  env: {
    browser: true,
  },
  extends: [
    '../../.eslintrc.cjs',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: ['react-refresh'],
  rules: {
    // Add any library-specific overrides or additional rules here
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/display-name': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'react/prop-types': 'off',
  },
}
