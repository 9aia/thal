export function now() {
  return new Date()
}

export function fromSToMillis(seconds: number) {
  return seconds * 1000
}

export function fromMillisToS(millis: number) {
  return Math.floor(millis / 1000)
}

export function isYesterday(date: Date) {
  const today = new Date()
  const workDate = new Date(date.getTime())

  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  workDate.setHours(0, 0, 0, 0)
  yesterday.setHours(0, 0, 0, 0)

  return workDate.getTime() === yesterday.getTime()
}

export function isThisWeek(date: Date) {
  const currentDate = new Date()
  const workDate = new Date(date.getTime())

  currentDate.setHours(0, 0, 0, 0)
  workDate.setHours(0, 0, 0, 0)

  const dayOfWeek = currentDate.getDay()

  const startOfWeek = new Date(currentDate)
  startOfWeek.setDate(currentDate.getDate() - dayOfWeek)

  const endOfWeek = new Date(currentDate)
  endOfWeek.setDate(currentDate.getDate() + (6 - dayOfWeek))

  return workDate >= startOfWeek && workDate <= endOfWeek
}

export function isToday(date: Date) {
  const currentDate = new Date()
  const workDate = new Date(date.getTime())

  workDate.setHours(0, 0, 0, 0)
  currentDate.setHours(0, 0, 0, 0)

  return workDate.getTime() === currentDate.getTime()
}
