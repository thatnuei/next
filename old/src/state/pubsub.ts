import { autobind } from "../helpers/common/autobind"

type Listener<T> = (event: T) => void

export class PubSub<T = void> {
  private subscribers = new Set<Listener<T>>()

  constructor() {
    autobind(this)
  }

  subscribe(listener: Listener<T>) {
    this.subscribers.add(listener)
    return () => {
      this.subscribers.delete(listener)
    }
  }

  publish(event: T) {
    this.subscribers.forEach((sub) => sub(event))
  }
}
