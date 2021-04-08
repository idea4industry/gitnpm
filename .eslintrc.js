module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  plugins: [
    '@typescript-eslint',
    'prettier',
    'only-warn',
    'sonarjs',
    'jest', "json"
  ],
  extends: [
    'airbnb-typescript/base',
    "plugin:json/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:sonarjs/recommended",
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    "plugin:jest/recommended"
  ],
  parser: '@typescript-eslint/parser',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './__tests__/tsconfig.json',
  },
  "settings": {
    "import/resolver": {
      "node": {
        "extensions": [".js", ".jsx", ".ts", ".tsx"],
        moduleDirectory: ['node_modules', 'src/'],

      }
    }
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off', //["error", { "prefixWithI": "always" }]
    '@typescript-eslint/no-floating-promises': 'error',
    "no-unused-vars": "off",
    '@typescript-eslint/no-unused-vars': "off",
    '@typescript-eslint/no-unused-vars-experimental': ["error"],
    'no-underscore-dangle': 'off',
    'import/named': 'off',
    'import/no-unresolved': 'off',
    'require-await': 'error',
    'import/prefer-default-export': 'off',
    "complexity": ["error", 5],
    "no-void": "off",
    "max-lines-per-function": ["error", 30],
    "max-lines": ["error", 100]

    // "no-multiple-empty-lines": [2, { "max": 0, "maxEOF": 0 }]
    // "comma-dangle": ["error", "never"]
    // 'max-len': ['error', { code: 80 }]
  }
}
