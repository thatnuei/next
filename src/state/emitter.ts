import { useEffect } from "react"

export type Listener<Value> = (value: Value) => void

export type Unlisten = () => void

export interface EmitterLike<Value> {
  listen(listener: Listener<Value>): Unlisten
}

export interface Emitter<Value> extends EmitterLike<Value> {
  emit(value: Value): void
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
  }

  return emitter
}

export function useEmitterListener<Value>(
  emitter: EmitterLike<Value>,
  listener: Listener<Value>,
) {
  useEffect(() => emitter.listen(listener))
}
