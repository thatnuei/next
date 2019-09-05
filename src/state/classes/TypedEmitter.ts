type AnyCallback = (value: any) => void

export default class TypedEmitter<EventMap extends object> {
  private listeners = new Map<string | number | symbol, Set<AnyCallback>>()

  listen<E extends keyof EventMap>(
    event: E,
    callback: (value: EventMap[E]) => void,
  ) {
    const listeners = this.getListeners(event)

    listeners.add(callback)

    const unlisten = () => {
      listeners.delete(callback)

      if (listeners.size === 0) {
        this.listeners.delete(event)
      }
    }

    return unlisten
  }

  notify<E extends keyof EventMap>(event: E, value: EventMap[E]) {
    const listeners = this.getListeners(event)
    listeners.forEach((callback) => callback(value))
  }

  removeListeners() {
    this.listeners.clear()
  }

  waitForEvent<EventType extends keyof EventMap>(type: EventType) {
    return new Promise<{ type: EventType; value: EventMap[EventType] }>(
      (resolve) => {
        const unlisten = this.listen(type, (value) => {
          resolve({ type, value })
          unlisten()
        })
      },
    )
  }

  private getListeners<K extends keyof EventMap>(event: K) {
    let listeners = this.listeners.get(event)
    if (!listeners) {
      listeners = new Set()
      this.listeners.set(event, listeners)
    }
    return listeners
  }
}
