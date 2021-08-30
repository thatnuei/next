import { isEqual as isDeepEqual } from "lodash-es"
import { useEffect, useState } from "react"
import type { Emitter } from "./emitter"
import { createEmitter } from "./emitter"

export interface Store<Value>
  extends Pick<Emitter<Value>, "listen" | "useListener"> {
  get value(): Value
  select<Derived>(getDerivedValue: (state: Value) => Derived): Store<Derived>
}

export interface WritableStore<Value> extends Store<Value> {
  set(state: Value): void
  update(fn: (oldState: Value) => Value): void
  merge(state: Partial<Value>): void
}

type IsEqualFn = (a: unknown, b: unknown) => boolean

export function createStore<Value>(value: Value): WritableStore<Value> {
  const emitter = createEmitter<Value>()

  const store: WritableStore<Value> = {
    ...emitter,

    get value() {
      return value
    },

    set: (newState) => {
      value = newState
      emitter.emit(value)
    },

    update: (fn) => {
      store.set(fn(value))
    },

    merge: (newState) => {
      store.set({ ...value, ...newState })
    },

    select: (getDerivedValue) => createDerivedStore(store, getDerivedValue),
  }

  return store
}

function createDerivedStore<Value, Derived>(
  source: Store<Value>,
  getDerivedValue: (value: Value) => Derived,
): Store<Derived> {
  const store: Store<Derived> = {
    get value() {
      return getDerivedValue(source.value)
    },

    listen(listener) {
      return source.listen((value) => listener(getDerivedValue(value)))
    },

    useListener(listener) {
      useEffect(() => store.listen(listener))
    },

    select: (getDerivedValue) => createDerivedStore(store, getDerivedValue),
  }

  return store
}

export function useStoreValue<Value>(
  store: Store<Value>,
  isEqual: IsEqualFn = isDeepEqual,
) {
  const [state, setState] = useState(store.value)

  useEffect(() => {
    return store.listen((newState) => {
      setState((current) => (isEqual(current, newState) ? current : newState))
    })
  }, [isEqual, store])

  return state
}
