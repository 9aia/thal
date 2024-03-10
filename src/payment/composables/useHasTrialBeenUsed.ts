export default () => {
  const user = useUser()

  const hasTrialBeenUsed = useCookie<number>('free_trial_used', {
    path: '/'
  })

  return computed(() => hasTrialBeenUsed.value === 1 || user.value?.free_trial_used === 1)
}
