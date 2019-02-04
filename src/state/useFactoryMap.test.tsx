import React from "react"
import { render } from "react-testing-library"
import useFactoryMap, { FactoryMapState } from "./useFactoryMap"

type User = { greeting: string }
const createUser = (name: string): User => ({ greeting: `hello ${name}` })

const testHook = (fn: () => void) => {
  const Test = () => {
    fn()
    return null
  }
  return render(<Test />)
}

test(`get - creates a new item if it doesn't exist`, () => {
  let map!: FactoryMapState<User>
  testHook(() => (map = useFactoryMap(createUser)))
  expect(map.get("world").greeting).toBe("hello world")
})

test(`get - returns existing item`, () => {
  let map!: FactoryMapState<User>
  testHook(() => (map = useFactoryMap(createUser)))

  const prev = map.get("world")
  expect(map.get("world")).toBe(prev)
})

test(`get - returns different item for different key`, () => {
  let map!: FactoryMapState<User>
  testHook(() => (map = useFactoryMap(createUser)))

  const prev = map.get("world")
  expect(map.get("world?")).not.toBe(prev)
})

test(`set`, () => {
  let map!: FactoryMapState<User>
  testHook(() => (map = useFactoryMap(createUser)))

  const value = { greeting: "hello world" }
  map.set("world", value)
  expect(map.get("world")).toBe(value)
})

test("update - return new item", () => {
  let map!: FactoryMapState<User>
  testHook(() => (map = useFactoryMap(createUser)))

  map.update("world", () => ({ greeting: "hello moon" }))

  expect(map.get("world")).toEqual({ greeting: "hello moon" })
})

test("values", () => {
  let map!: FactoryMapState<User>
  testHook(() => (map = useFactoryMap(createUser)))

  const a = map.get("a")
  const b = map.get("b")

  expect(map.values).toEqual([a, b])
})

test("values - filters out undefined values", () => {
  // the internal type for items is Record<string, T | undefined>
  // since undefined values can sneak in there, we should make sure that
  // we don't get them when we get the map values
  let map!: FactoryMapState<User>
  testHook(() => (map = useFactoryMap(createUser)))

  map.merge({ a: undefined as any })

  expect(map.values).toEqual([])
})

test("keys", () => {
  let map!: FactoryMapState<User>
  testHook(() => (map = useFactoryMap(createUser)))
  map.get("a")
  map.get("b")
  expect(map.keys).toEqual(["a", "b"])
})

test("merge", () => {
  let map!: FactoryMapState<User>
  testHook(() => (map = useFactoryMap(createUser)))

  map.get("a")

  map.merge({
    b: { greeting: "hi" },
    c: { greeting: "there" },
  })

  expect(map.items).toEqual({
    a: { greeting: "hello a" },
    b: { greeting: "hi" },
    c: { greeting: "there" },
  })
})
