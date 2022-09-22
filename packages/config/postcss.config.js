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
      importFrom: [
        { customMedia: { '--mobile': '(min-width: 320px)' } },
        { customMedia: { '--large-mobile': '(min-width: 480px)' } },
        { customMedia: { '--tablet': '(min-width: 768px)' } },
        { customMedia: { '--small-desktop': '(min-width: 1024px)' } },
        { customMedia: { '--large-desktop': '(min-width: 1312px)' } },
        { customSelectors: { ':--heading': 'h1, h2, h3, h4, h5, h6' } },
      ],
      features: {
        'logical-properties-and-values': {
          dir: 'ltr'
        }
      }
    }),
    postcssReporter({
      clearReportedMessages: true,
    }),
    // flexGapPolyfill(),
  ],
};
