export function useNavigationDirection() {
  const navigationDirection = useState<'forward' | 'back'>('navigationDirection', () => 'forward')

  return navigationDirection
}

export default useNavigationDirection
