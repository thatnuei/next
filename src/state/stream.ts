import { useEffect, useState } from "react"

export type StreamListener<T> = (event: T) => void

export class Stream<T> {
  private listeners = new Set<StreamListener<T>>()

  listen = (listener: StreamListener<T>) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  send = (event: T) => {
    for (const listener of [...this.listeners]) {
      listener(event)
    }
  }
}

export function useStreamListener<T>(
  stream: Stream<T>,
  listener: StreamListener<T>,
) {
  useEffect(() => stream.listen(listener), [stream, listener])
}

export function useStreamValue<T>(stream: Stream<T>, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue)
  useStreamListener(stream, setValue)
  return value
}
