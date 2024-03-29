// @todo @deprecated ? @yarbsemaj/adapter-lambda
// import adapter from '@yarbsemaj/adapter-lambda';
// import { adapter } from 'sveltekit-adapter-aws';
import { adapter } from '@freedev/sveltekit-adapter';
import preprocess from 'svelte-preprocess';
// @todo throws error due to .ts file
// import { AWS_ROUTE_53_ZONE_NAME, STACK_NAME } from '@freedev/constants';

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
			FQDN: 'try.freedev.app',
			stackName: 'dev', // STACK_NAME
			zoneName: 'eu-central-1', // AWS_ROUTE_53_ZONE_NAME,
    }),
	}
};

export default config;
