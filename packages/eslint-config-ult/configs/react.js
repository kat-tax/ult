module.exports = {
  parserOptions: {
    ecmaFeatures: {jsx: true},
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: ['react'],
  rules: {
    'react/jsx-curly-spacing': ['error', 'always'],
    'react/jsx-equals-spacing': ['error', 'never'],
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react/no-danger': 'error',
    'react/jsx-no-bind': ['error', {allowArrowFunctions: true}],
    'jsx-quotes': ['error', 'prefer-single'],
  },
};
