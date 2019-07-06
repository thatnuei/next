type AnyCallback = (value: any) => void

export default class TypedEmitter<EventMap extends object> {
  private listeners = new Map<string | number | symbol, Set<AnyCallback>>()

  listen<K extends keyof EventMap>(
    event: K,
    callback: (value: EventMap[K]) => void,
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

  notify<K extends keyof EventMap>(event: K, value: EventMap[K]) {
    const listeners = this.getListeners(event)
    listeners.forEach((callback) => callback(value))
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
