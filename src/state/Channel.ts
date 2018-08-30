export type ChannelListener<T> = (value: T) => void

export class Channel<T> {
  private listeners = new Set<ChannelListener<T>>()

  addListener(listener: ChannelListener<T>) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  send(value: T) {
    this.listeners.forEach((listener) => listener(value))
  }
}
