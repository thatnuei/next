import { useEffect } from ".pnpm/@types+react@17.0.14/node_modules/@types/react"

const noValue = Symbol("noValue")

export class Emitter<Value> {
  private listeners = new Set<Listener<Value>>()
  private queuedEmit: Value | typeof noValue = noValue

  listen(listener: Listener<Value>) {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  emit(value: Value) {
    this.listeners.forEach((listener) => listener(value))
  }

  queueEmit(value: Value) {
    this.queuedEmit = value
    queueMicrotask(() => {
      if (this.queuedEmit === noValue) return
      this.emit(this.queuedEmit)
      this.queuedEmit = noValue
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
