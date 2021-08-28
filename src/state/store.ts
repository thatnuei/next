import { useState } from "react"
import { Emitter, useEmitterListener } from "./emitter"

export abstract class Store<State> extends Emitter<Readonly<State>> {
  private _state: Readonly<State>

  constructor(state: Readonly<State>) {
    super()
    this._state = state
  }

  get state(): Readonly<State> {
    return this._state
  }

  protected set state(value: Readonly<State>) {
    this._state = value
    this.queueEmit(this._state)
  }
}

export abstract class ObjectStore<
  Value extends Record<string, unknown>,
> extends Store<Value> {
  protected merge(newProperties: Partial<Value>): void {
    this.state = { ...this.state, ...newProperties }
  }
}

export function useStoreSelector<State, Selected>(
  store: Store<State>,
  selector: (value: Readonly<State>) => Selected,
): Readonly<Selected> {
  const [state, setState] = useState(selector(store.state))
  useEmitterListener(store, (value) => setState(selector(value)))
  return state
}

export function useStoreState<State>(store: Store<State>): Readonly<State> {
  return useStoreSelector(store, (state) => state)
}

export function useStoreKey<
  State extends Record<string, unknown>,
  Key extends keyof State,
>(store: ObjectStore<State>, key: Key): Readonly<State[Key]> {
  return useStoreSelector(store, (state) => state[key])
}
