// TODO: remove this plugin once tailwindcss fixes this issue
// https://github.com/tailwindlabs/tailwindcss/discussions/16119

function ignoreTailwindSourceMapBroken() {
  return {
    apply: 'build',
    name: 'vite-plugin-ignore-tailwind-sourcemap-broken',
    configResolved(config: any) {
      const originalOnWarn = config.build.rollupOptions.onwarn
      config.build.rollupOptions.onwarn = (warning: any, warn: any) => {
        if (
          warning.code === 'SOURCEMAP_BROKEN'
          && warning.plugin === '@tailwindcss/vite:generate:build'
        ) {
          return
        }

        if (originalOnWarn) {
          originalOnWarn(
            warning,
            warn,
          )
        }
        else {
          warn(
            warning,
          )
        }
      }
    },
  } as any
}

export default ignoreTailwindSourceMapBroken
