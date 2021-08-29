import { useEffect } from "react"

export type Listener<Value> = (value: Value) => void

export type Unlisten = () => void

export interface Emitter<Value> {
  listen(listener: Listener<Value>): Unlisten
  emit(value: Value): void
  useListener(listener: Listener<Value>): void
}

export function createEmitter<Value>(): Emitter<Value> {
  const listeners = new Set<Listener<Value>>()

  const emitter: Emitter<Value> = {
    listen(listener) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },

    emit(value) {
      for (const listener of listeners) {
        listener(value)
      }
    },

    useListener(listener) {
      useEffect(() => emitter.listen(listener))
    },
  }

  return emitter
}
