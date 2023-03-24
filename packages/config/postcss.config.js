// eslint-disable-next-line import/no-extraneous-dependencies
const postcssPresetEnv = require('postcss-preset-env');
// eslint-disable-next-line import/no-extraneous-dependencies
// const flexGapPolyfill = require('flex-gap-polyfill');
const postcssImport = require('postcss-import');
const stylelint = require('stylelint');
const postcssReporter = require('postcss-reporter');

module.exports = {
  plugins: [
    postcssImport({
      plugins: [stylelint],
    }),
    postcssPresetEnv({
      stage: 1,
      features: {
        'logical-properties-and-values': {
          dir: 'ltr'
        },
        'custom-properties': {
          disableDeprecationNotice: true
        }
      }
    }),
    postcssReporter({
      clearReportedMessages: true,
    }),
    // flexGapPolyfill(),
  ],
};
