export default () => {
  const hasTrialBeenUsed = useCookie<number>('thal_free_trial_used', {
    path: '/',
  })

  return computed(() => hasTrialBeenUsed.value === 1)
}
