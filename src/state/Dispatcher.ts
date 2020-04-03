import { useEffect } from "react"

type Listener<E> = (event: E) => void

export class Dispatcher<E> {
  private listeners = new Set<Listener<E>>()

  listen(listener: Listener<E>) {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  dispatch(event: E) {
    for (const listener of this.listeners) {
      listener(event)
    }
  }
}

export function useDispatcherListener<E>(
  dispatcher: Dispatcher<E>,
  listener: Listener<E>,
) {
  useEffect(() => dispatcher.listen(listener), [dispatcher, listener])
}
