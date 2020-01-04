type Listener<A extends unknown[]> = (...args: A) => void

export class ListenerGroup<A extends unknown[]> {
  private listeners = new Set<Listener<A>>()

  add = (listener: Listener<A>) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  clear = () => {
    this.listeners.clear()
  }

  call = (...args: A) => {
    this.listeners.forEach((it) => it(...args))
  }
}
