require('esbuild').build({
  entryPoints: ['./src/sign-up'],
  bundle: true,
  outfile: './build/sign-up/index.js',
}).catch(() => process.exit(1))