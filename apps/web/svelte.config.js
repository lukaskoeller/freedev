import adapter from '@yarbsemaj/adapter-lambda';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			postcss: true
		})
	],
	// @see https://github.com/sveltejs/kit/tree/master/packages/adapter-static
	kit: {
		adapter: adapter({
      // default options are shown
      pages: 'build',
      assets: 'build',
      fallback: '404.html',
      precompress: false
    }),

    prerender: {
      // This can be false if you're using a fallback (i.e. SPA mode)
      default: false
    },

		methodOverride: {
			allowed: ['PUT', 'PATCH', 'DELETE'],
		},
	}
};

export default config;
