export class Channel<L extends (value?: any) => any> {
  private listeners = new Set<L>()

  listen = (listener: L) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  removeListeners = () => {
    this.listeners.clear()
  }

  send = (...args: Parameters<L>) => {
    this.listeners.forEach((it) => it(...args))
  }
}