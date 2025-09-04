import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ['eslint.config.mjs'],
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
    rules: {
      'semi': ['error', 'always'],
      'indent': [
        'error',
        2,
        {
          'outerIIFEBody': 'off',
          'VariableDeclarator': 'first',
          'SwitchCase': 1,
          'MemberExpression': 1,
        }
      ],
      'linebreak-style': ['error', 'windows'],
      'quotes': ['error', 'single'],
      'brace-style': [
        'error',
        'stroustrup',
        { 'allowSingleLine': true }
      ],
      'max-len': [
        'error',
        {
          'code': 100,
          'comments': 100,
          'ignoreUrls': true,
          'ignoreStrings': true,
          'ignoreTemplateLiterals': true,
          'ignoreRegExpLiterals': true,
        }
      ],
      'comma-style': ['error', 'last'],
      'nonblock-statement-body-position': ['error', 'beside'],
      'function-call-argument-newline': ['error', 'consistent'],
      'function-paren-newline': ['error', 'multiline-arguments'],
      'array-bracket-newline': ['error', 'consistent'],
      'no-trailing-spaces': ['error'],
      'no-multiple-empty-lines': [
        'error',
        {
          'max': 1,
          'maxEOF': 0
        }
      ],
      'key-spacing': [
        'error',
        {
          'beforeColon': false,
          'afterColon': true,
          'mode': 'strict'
        }
      ],
      'keyword-spacing': [
        'error',
        {
          'before': true,
          'after': true
        }
      ],
      'comma-spacing': [
        'error',
        {
          'before': false,
          'after': true
        }
      ],
      'space-before-blocks': ['error', 'always'],
      'block-spacing': ['error', 'always'],
      'func-call-spacing': ['error', 'never'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'space-in-parens': ['error', 'never'],
      'space-before-function-paren': [
        'error',
        {
          'anonymous': 'never',
          'named': 'never',
          'asyncArrow': 'always'
        }
      ],
      'arrow-spacing': [
        'error',
        {
          'before': true,
          'after': true
        }
      ],
      'space-infix-ops': ['error'],
      'space-unary-ops': [
        'error',
        {
          'words': true,
          'nonwords': false
        }
      ],
      'no-warning-comments': ['error'],
      'spaced-comment': ['error', 'always'],
      'capitalized-comments': [
        'error',
        'always',
        {
          'ignoreConsecutiveComments': true,
          'ignorePattern': 'jQuery'
        }
      ],
      'multiline-comment-style': ['error', 'separate-lines'],
      'no-inline-comments': ['error'],
      'no-return-assign': ['error', 'always'],
      'semi-spacing': [
        'error',
        {
          'before': false,
          'after': true
        }
      ],
      'no-debugger': 'error',
    }
  },

]);
