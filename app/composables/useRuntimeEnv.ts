function useRuntimeEnv() {
  const runtimeConfig = useRuntimeConfig()
  return runtimeConfig.public.RUNTIME_ENV as 'dev' | 'preview' | 'prod'
}

export default useRuntimeEnv
