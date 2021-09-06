type EventLike = {
  preventDefault(): void
}

export function preventDefault<Event extends EventLike>(
  callback: (event: Event) => void,
) {
  return function withDefaultPrevented(event: Event) {
    event.preventDefault()
    callback(event)
  }
}
