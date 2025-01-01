export default () => {
  const hasTrialBeenUsed = useCookie<number>('free_trial_used', {
    path: '/',
  })

  return computed(() => hasTrialBeenUsed.value === 1)
}
