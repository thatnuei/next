import { useEffect } from "react"

export class Emitter<Value> {
  private listeners = new Set<Listener<Value>>()
  private callbackId: number | undefined = undefined

  listen(listener: Listener<Value>) {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  emit(value: Value) {
    for (const listener of this.listeners) {
      listener(value)
    }
  }

  queueEmit(value: Value) {
    if (this.callbackId !== undefined) {
      cancelIdleCallback(this.callbackId)
    }

    this.callbackId = requestIdleCallback(() => {
      this.emit(value)
    })
  }
}

export type Listener<Value> = (value: Value) => void

export type Unlisten = () => void

export function useEmitterListener<Value>(
  emitter: Emitter<Value>,
  listener: Listener<Value>,
) {
  useEffect(() => emitter.listen(listener))
}
