// @todo @deprecated ? @yarbsemaj/adapter-lambda
// import adapter from '@yarbsemaj/adapter-lambda';
import { adapter } from 'sveltekit-adapter-aws';
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
		// adapter: adapter({
    //   // default options are shown
    //   pages: 'build',
    //   assets: 'build',
    //   fallback: '404.html',
    //   precompress: false
    // }),
		adapter: adapter({
      autoDeploy: true,
			FQDN: 'freedev.app',
			stackName: 'freedev-app'
    }),
	}
};

export default config;
