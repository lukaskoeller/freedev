export default {
  exclude: [
    'src/**/*.stories.@(js|jsx|ts|tsx)',
    'src/vite-env.d.ts',
  ],
  /** Run in watch mode, runs on file changes */
  watch: true,
  /** Enable special handling for litelement */
  litelement: true,
}