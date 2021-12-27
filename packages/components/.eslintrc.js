module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:lit/recommended',
    '@open-wc/eslint-config',
    'eslint-config-prettier',
    'plugin:storybook/recommended',
  ],
  plugins: [
    '@typescript-eslint'
  ],
  ignorePatterns: [
    'build'
  ],
}