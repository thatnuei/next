import type { Draft } from "immer"
import produce from "immer"
import { useState } from "react"
import type { Dict } from "../common/types"
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
    if (this._state === value) return
    this._state = value
    this.emit(this._state)
  }

  protected merge(newProperties: Partial<State>): void {
    this.state = { ...this.state, ...newProperties }
  }

  protected update(recipe: (state: Draft<State>) => void): void {
    this.state = produce(this.state, recipe)
  }
}

export abstract class DictStore<Value> extends Store<Dict<Value>> {
  constructor(readonly fallback: (key: string) => Value) {
    super({})
  }

  getItemWithFallback(key: string): Value {
    return this.state[key] ?? this.fallback(key)
  }

  setItem(key: string, value: Value): void {
    if (this.state[key] === value) return
    this.state = { ...this.state, [key]: value }
  }

  protected setItems(items: Dict<Value>): void {
    this.state = { ...this.state, ...items }
  }

  protected updateItem(
    key: string,
    getNewItem: (oldItem: Value) => Value,
  ): void {
    const currentItem = this.state[key] ?? this.fallback(key)
    this.setItem(key, getNewItem(currentItem))
  }
}

export function useStoreSelect<State, Selected>(
  store: Store<State>,
  select: (value: Readonly<State>) => Selected,
  isEqual: IsEqualFn = Object.is,
): Readonly<Selected> {
  const [state, setState] = useState(select(store.state))
  useEmitterListener(store, (state) => {
    const newState = select(state)
    if (!isEqual(state, newState)) {
      setState(newState)
    }
  })
  return state
}

export function useStoreState<State>(store: Store<State>): Readonly<State> {
  return useStoreSelect(store, (state) => state)
}

export function useStoreKey<
  State extends Record<string, unknown>,
  Key extends keyof State,
>(store: Store<State>, key: Key): Readonly<State[Key]> {
  return useStoreSelect(store, (state) => state[key])
}

type IsEqualFn = (a: unknown, b: unknown) => boolean
