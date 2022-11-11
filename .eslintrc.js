const { defineConfig } = require('eslint-define-config');
module.exports = defineConfig({
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    parser: '@typescript-eslint/parser',
  },
  extends: [
    'plugin:vue/recommended',
    'plugin:vuetify/base',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['vue', '@typescript-eslint'],
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './src']],
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.vue', '.scss', '.css'],
      },
    },
  },
  rules: {
    'vue/script-setup-uses-vars': 'error',
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'always',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      },
    ],
    'vue/no-unused-properties': [
      'error',
      {
        groups: ['props', 'data', 'computed', 'setup'],
        deepData: false,
        ignorePublicMembers: false,
      },
    ],
    'vue/require-name-property': ['error'],
    'vue/component-definition-name-casing': ['error', 'PascalCase'],
    'vue/prop-name-casing': ['error', 'camelCase'],
    'vue/component-options-name-casing': ['error', 'PascalCase'],
    'vue/no-use-computed-property-like-method': ['error'],
    'vue/v-on-function-call': ['error'],
    'vue/require-default-prop': ['error'],
    'vue/v-slot-style': [
      'error',
      {
        atComponent: 'shorthand',
        default: 'shorthand',
        named: 'shorthand',
      },
    ],
    'vue/no-unused-refs': ['error'],
    'vue/custom-event-name-casing': [
      'error',
      'camelCase',
      {
        ignores: [],
      },
    ],
    'vue/valid-v-slot': ['error'],
    'vue/no-reserved-props': [
      'error',
      {
        vueVersion: 2,
      },
    ],
    'vue/max-len': [
      'error',
      {
        code: 120,
        template: 120,
        tabWidth: 2,
        comments: 80,
        ignorePattern: '^`.*`$',
        ignoreComments: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
        ignoreHTMLAttributeValues: true,
        ignoreHTMLTextContents: true,
      },
    ],
    'vue/component-tags-order': [
      'error',
      {
        order: [['template', 'script'], 'style'],
      },
    ],
    'vue/attributes-order': [
      'error',
      {
        order: [
          'DEFINITION',
          'LIST_RENDERING',
          'CONDITIONALS',
          'RENDER_MODIFIERS',
          'GLOBAL',
          ['UNIQUE', 'SLOT'],
          'TWO_WAY_BINDING',
          'OTHER_DIRECTIVES',
          'OTHER_ATTR',
          'EVENTS',
          'CONTENT',
        ],
        alphabetical: true,
      },
    ],
    'vue/order-in-components': [
      'error',
      {
        order: [
          'el',
          'name',
          'key',
          'parent',
          'functional',
          ['delimiters', 'comments'],
          ['components', 'directives', 'filters'],
          'extends',
          'mixins',
          ['provide', 'inject'],
          'ROUTER_GUARDS',
          'layout',
          'middleware',
          'validate',
          'scrollToTop',
          'transition',
          'loading',
          'inheritAttrs',
          'model',
          ['props', 'propsData'],
          'emits',
          'setup',
          'fetch',
          'asyncData',
          'data',
          'head',
          'computed',
          'watch',
          'watchQuery',
          'LIFECYCLE_HOOKS',
          'methods',
          ['template', 'render'],
          'renderError',
        ],
      },
    ],
    'vue/no-empty-component-block': ['error'],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', ['internal', 'parent', 'sibling', 'index'], 'unknown'],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'sort-vars': ['error'],

    'vue/no-template-shadow': ['off'],
    'vue/multi-word-component-names': ['off'],
    'vue/no-v-html': ['off'],
    '@typescript-eslint/no-this-alias': ['off'],
    '@typescript-eslint/no-explicit-any': ['off'],
    // 'sort-imports': [
    //   'error',
    //   {
    //     ignoreCase: false,
    //     ignoreDeclarationSort: false,
    //     ignoreMemberSort: false,
    //     memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
    //   },
    // ],
  },
  ignorePatterns: [
    '*.sh',
    'node_modules',
    '*.md',
    '*.woff',
    '*.ttf',
    '.vscode',
    '.idea',
    'dist',
    '/public',
    '/docs',
    '.husky',
    '.local',
    '/bin',
    'Dockerfile',
    'volar.config.js',
    '.eslintrc.js',
  ],
});
