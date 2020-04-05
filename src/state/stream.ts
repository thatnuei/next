import { useEffect } from "react"

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
    this.listeners.forEach((listener) => listener(event))
  }
}

export function useStreamListener<T>(
  stream: Stream<T>,
  listener: StreamListener<T>,
) {
  useEffect(() => stream.listen(listener), [stream, listener])
}
