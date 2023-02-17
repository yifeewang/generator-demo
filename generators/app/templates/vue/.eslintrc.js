module.exports = {
  root: true,
  env: {
    node: true,
  },
  globals: {
    AlipayJSBridge: false,
    VConsole: false,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'vue/no-multiple-template-root': 0,
    'vue/no-v-model-argument': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
