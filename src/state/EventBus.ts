import { Values } from "../helpers/types"

type EventMap = {
  [event: string]: any
}

export class EventBus<TEventMap extends EventMap> {
  private listeners = new Map<keyof TEventMap, Set<(value: Values<TEventMap>) => void>>()

  listen<K extends keyof TEventMap>(event: K, listener: (value: TEventMap[K]) => void) {
    const listeners = this.listeners.get(event) || new Set()
    listeners.add(listener)
    this.listeners.set(event, listeners)
  }

  send<K extends keyof TEventMap>(event: K, value: TEventMap[K]) {
    const listeners = this.listeners.get(event)
    if (listeners) {
      listeners.forEach((listener) => listener(value))
    }
  }
}
