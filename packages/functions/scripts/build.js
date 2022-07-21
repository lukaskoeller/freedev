require('esbuild').build({
  entryPoints: ['./src/sign-up'],
  bundle: true,
  minify: true,
  platform: 'node',
  target: 'node16.16.0',
  outfile: './build/sign-up/index.js',
  format: 'cjs',

}).catch(() => process.exit(1))