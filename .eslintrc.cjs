module.exports = {
  'parser': '@typescript-eslint/parser',
  'extends': [
    'plugin:react/recommended',
    'react-app'
  ],
  'parserOptions': {
    'ecmaVersion': 2018,
    'sourceType': 'module',
    'ecmaFeatures': {
      'jsx': true
    }
  },
  'rules': {
    'indent': [ 'error', 2, { 'SwitchCase': 1 } ],
    'quotes': [ 'error', 'single', { 'avoidEscape': true, 'allowTemplateLiterals': true } ],
    'no-unused-vars': 'error',
    'no-console': 'error',
    'semi': 'error',
    'max-len': 'off',
    'no-extra-semi': 'error',
    'no-mixed-spaces-and-tabs': 'error',
    'no-trailing-spaces': [ 'error', { 'skipBlankLines': true, 'ignoreComments': false } ],
    'no-multiple-empty-lines': [ 'error', { 'max': 2, 'maxEOF': 1 } ],
    'brace-style': [ 'error', '1tbs' ],
    'comma-spacing': [ 'error', { 'before': false, 'after': true } ],
    'no-undef': 'error',
    'object-curly-spacing': [ 'error', 'always' ],
    'no-extra-parens': 'warn',
    'array-bracket-spacing': [ 'error', 'always' ],
    'no-irregular-whitespace': 'error',
    'no-multi-spaces': 'off',
    'no-new-object': 'warn',
    'no-useless-escape': 'error',
    'arrow-spacing': [ 'warn', { 'before': true, 'after': true } ],
    'no-var': 'error',
    'prefer-const': 'warn',
    'prefer-template': 'error',
    'no-useless-constructor': 'error',
    'no-empty-function': 'error',
    'prefer-arrow-callback': 'warn',
    'arrow-parens': [ 'warn', 'always' ],
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
  },
  'env': {
    'browser': true,
    'node': true
  },
  'settings': {
    'react': {
      'version': 'detect'
    }
  },
  'ignorePatterns': [ 'node_modules/', 'dist/' ],
};
