module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    warnOnUnsupportedTypeScriptVersion: false,
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
    },
  },
  env: {
    commonjs: true,
    browser: true,
    node: true,
    es6: true,
  },
  root: true,
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    'arrow-body-style': 'error',
    'arrow-parens': ['error', 'as-needed'],
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'always-multiline',
      },
    ],
    'constructor-super': 'error',
    curly: ['error', 'all'],
    'dot-notation': 'error',
    'eol-last': ['error', 'always'],
    eqeqeq: [
      'error',
      'always',
      {
        null: 'ignore',
      },
    ],
    'for-direction': 'error',
    'getter-return': 'error',
    'guard-for-in': 'error',
    'keyword-spacing': [
      'error',
      {
        before: true,
        after: true,
        overrides: {
          return: { after: true },
          throw: { after: true },
          case: { after: true },
        },
      },
    ],
    'linebreak-style': 'error',
    'max-len': [
      'error',
      {
        code: 140,
      },
    ],
    'new-parens': 'error',
    'no-caller': 'error',
    'no-case-declarations': 'error',
    'no-class-assign': 'error',
    'no-compare-neg-zero': 'error',
    'no-cond-assign': 'error',
    'no-console': 'error',
    'no-const-assign': 'error',
    'no-constant-condition': ['error', { checkLoops: false }],
    'no-control-regex': 'error',
    'no-debugger': 'error',
    'no-delete-var': 'error',
    'no-dupe-args': 'error',
    'no-dupe-class-members': 'error',
    'no-dupe-keys': 'error',
    'no-duplicate-case': 'error',
    'no-empty': 'error',
    'no-empty-character-class': 'error',
    'no-empty-pattern': 'error',
    'no-eval': 'error',
    'no-ex-assign': 'error',
    'no-extra-boolean-cast': 'error',
    'no-extra-semi': 'error',
    'no-fallthrough': 'error',
    'no-func-assign': 'error',
    'no-global-assign': 'error',
    'no-inner-declarations': 'error',
    'no-invalid-regexp': 'error',
    'no-irregular-whitespace': 'error',
    'no-mixed-spaces-and-tabs': 'error',
    'no-multiple-empty-lines': 'error',
    'no-new-symbol': 'error',
    'no-new-wrappers': 'error',
    'no-obj-calls': 'error',
    'no-octal': 'error',
    'no-redeclare': 'error',
    'no-regex-spaces': 'error',
    'no-self-assign': 'error',
    'no-sparse-arrays': 'error',
    'no-sequences': 'error',
    'no-this-before-super': 'error',
    'no-throw-literal': 'error',
    'no-trailing-spaces': 'error',
    'no-var': 'error',
    'no-unexpected-multiline': 'error',
    'no-undef-init': 'error',
    'no-unreachable': 'error',
    'no-unsafe-finally': 'error',
    'no-unsafe-negation': 'error',
    'no-unused-expressions': 'error',
    'no-unused-labels': 'error',
    'no-useless-escape': 'error',
    'one-var': ['error', 'never'],
    'prefer-const': 'error',
    radix: ['error', 'always'],
    'require-yield': 'error',
    'use-isnan': 'error',
    'valid-typeof': 'error',

    /** comments */
    'spaced-comment': ['error', 'always'],

    /** imports */
    'no-duplicate-imports': 'error',
    'import/order': [
      'error',
      {
        'newlines-between': 'always-and-inside-groups',
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
      },
    ],

    /** TypeScript related rules */
    '@typescript-eslint/adjacent-overload-signatures': 'error',
    '@typescript-eslint/array-type': 'error',
    '@typescript-eslint/ban-types': 'error',

    camelcase: 'off',
    '@typescript-eslint/camelcase': 'error',

    '@typescript-eslint/class-name-casing': 'error',
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      {
        allowExpressions: true,
      },
    ],
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      {
        accessibility: 'no-public',
      },
    ],

    indent: 'off',
    '@typescript-eslint/indent': [
      'error',
      4,
      {
        FunctionExpression: {
          parameters: 2,
          body: 1,
        },
        FunctionDeclaration: {
          parameters: 2,
          body: 1,
        },
        SwitchCase: 1,
      },
    ],

    '@typescript-eslint/interface-name-prefix': 'error',
    '@typescript-eslint/member-delimiter-style': 'error',
    '@typescript-eslint/member-naming': [
      'error',
      {
        protected: '^[a-z_]\\w+$',
        private: '^_[a-z]\\w+$',
        public: '^(UNSAFE_)?[a-z]\\w+$',
      },
    ],
    '@typescript-eslint/consistent-type-assertions': [
      'error',
      {
        objectLiteralTypeAssertions: 'never',
        assertionStyle: 'as',
      },
    ],

    'no-array-constructor': 'off',
    '@typescript-eslint/no-array-constructor': 'error',

    'no-empty-function': 'off',
    '@typescript-eslint/no-empty-function': 'error',

    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-implied-eval': 'error',
    '@typescript-eslint/no-inferrable-types': 'error',
    '@typescript-eslint/no-misused-new': 'error',
    '@typescript-eslint/no-namespace': 'error',
    '@typescript-eslint/no-parameter-properties': [
      'error',
      {
        allows: [
          'private',
          'protected',
          'private readonly',
          'protected readonly',
        ],
      },
    ],

    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        args: 'none',
        ignoreRestSiblings: true,
      },
    ],

    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': [
      'error',
      {
        classes: false,
        functions: false,
      },
    ],

    '@typescript-eslint/no-var-requires': 'error',
    '@typescript-eslint/prefer-namespace-keyword': 'error',

    quotes: 'off',
    '@typescript-eslint/quotes': [
      'error',
      'single',
      {
        allowTemplateLiterals: true,
      },
    ],

    semi: 'off',
    '@typescript-eslint/semi': 'error',

    'space-before-function-paren': 'off',
    '@typescript-eslint/space-before-function-paren': ['error', 'never'],

    '@typescript-eslint/triple-slash-reference': [
      'error',
      {
        path: 'never',
        types: 'never',
        lib: 'never',
      },
    ],
    '@typescript-eslint/type-annotation-spacing': 'error',

    /** Requiring type checking */
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
  },
};
