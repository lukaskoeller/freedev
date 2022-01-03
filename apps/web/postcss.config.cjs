const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcssPresetEnv = require('postcss-preset-env');

const mode = process.env.NODE_ENV;
const dev = mode === 'development';

const config = {
	plugins: [
		autoprefixer,
		postcssPresetEnv({
			stage: 1,
			// preserve: true,
			features: {
				'dir-pseudo-class': { dir: 'ltr' }
			}
		}),
		!dev &&
			cssnano({
				preset: 'default'
			})
	]
};

module.exports = config;
