import { isEqual as isDeepEqual } from "lodash-es"
import { useCallback, useEffect, useState } from "react"
import type { EmitterLike } from "./emitter"
import { createEmitter, useEmitterListener } from "./emitter"

export interface Store<Value> extends EmitterLike<Value> {
  get value(): Value
  select<Derived>(getDerivedValue: (state: Value) => Derived): Store<Derived>
}

export interface WritableStore<Value> extends Store<Value> {
  set(state: Value): void
  update(fn: (oldState: Value) => Value): void
  mergeSet(state: Partial<Value>): void
}

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

    mergeSet: (newState) => {
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

    select: (getDerivedValue) => createDerivedStore(store, getDerivedValue),
  }

  return store
}

export function combineStores<StoreValues extends readonly unknown[]>(
  ...stores: { [key in keyof StoreValues]: Store<StoreValues[key]> }
): Store<StoreValues> {
  const store: Store<StoreValues> = {
    get value() {
      return stores.map((store) => store.value) as unknown as StoreValues
    },

    listen(listener) {
      const unlistenFunctions = stores.map((subStore) =>
        subStore.listen(() => listener(store.value)),
      )

      return () => unlistenFunctions.forEach((unlisten) => unlisten())
    },

    select: (getDerivedValue) => createDerivedStore(store, getDerivedValue),
  }

  return store
}

export function useStoreValue<Value>(
  store: Store<Value>,
  isEqual: (a: Value, b: Value) => boolean = isDeepEqual,
) {
  const [state, setState] = useState(store.value)

  const setIfChanged = useCallback(
    (newState: Value) => {
      setState((current) => (isEqual(current, newState) ? current : newState))
    },
    [isEqual],
  )

  useEffect(() => setIfChanged(store.value), [setIfChanged, store])
  useEmitterListener(store, setIfChanged)

  return state
}
