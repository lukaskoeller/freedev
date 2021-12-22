// const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcssPresetEnv = require('postcss-preset-env');
const postcssJitProps = require('postcss-jit-props');

const mode = process.env.NODE_ENV;
const dev = mode === 'development';

const config = {
	plugins: [
		// autoprefixer(),
		postcssPresetEnv({
			stage: 1,
			// preserve: true,
			features: {
				'dir-pseudo-class': { dir: 'ltr' }
			}
		}),
		!dev && postcssJitProps({
      files: [
        './src/styles/props.css'
      ]
    }),

		!dev &&
			cssnano({
				preset: 'default'
			})
	]
};

module.exports = config;
