const glob = require('tiny-glob');
const { build } = require('esbuild');

(async () => {
  let entryPoints = await glob('./src/*/*.{ts}');
  try {
    await build({
      entryPoints,
      bundle: true,
      minify: true,
      platform: 'node',
      target: 'node16.16.0',
      outdir: './build',
      format: 'cjs',
    });
  } catch (error) {
    process.exit(1); 
  }
})();