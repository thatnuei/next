import { isEqual as isDeepEqual } from "lodash-es"
import { useEffect, useState } from "react"
import type { Emitter } from "./emitter"
import { createEmitter } from "./emitter"

export interface Store<Value>
  extends Pick<Emitter<Value>, "listen" | "useListener"> {
  get value(): Value
  useValue(isEqual?: isEqualFn): Value
}

export interface WritableStore<Value> extends Store<Value> {
  set(state: Value): void
  update(fn: (oldState: Value) => Value): void
  merge(state: Partial<Value>): void
  select<Derived>(getDerivedValue: (state: Value) => Derived): Store<Derived>
}

type isEqualFn = (a: unknown, b: unknown) => boolean

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

    select: (getDerivedValue) => {
      return createDerivedStore(store, getDerivedValue)
    },

    useValue(isEqual = isDeepEqual) {
      const [state, setState] = useState(store.value)

      useEffect(() => {
        return emitter.listen((newState) => {
          if (!isEqual(newState, state)) {
            setState(newState)
          }
        })
      })

      return state
    },
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

    useValue(isEqual = Object.is) {
      const [state, setState] = useState(store.value)

      useEffect(() => {
        return source.listen((sourceState) => {
          const newState = getDerivedValue(sourceState)
          if (!isEqual(newState, state)) {
            setState(newState)
          }
        })
      })

      return state
    },
  }

  return store
}
