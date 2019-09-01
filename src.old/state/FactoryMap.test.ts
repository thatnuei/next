import FactoryMap from "./FactoryMap"

const createGreeting = (name: string) => ({ greeting: `hello ${name}` })

test(`get - creates a new item if it doesn't exist`, () => {
  const map = new FactoryMap(createGreeting)
  expect(map.get("world").greeting).toBe("hello world")
})

test(`get - returns existing item`, () => {
  const map = new FactoryMap(createGreeting)
  const prev = map.get("world")
  expect(map.get("world")).toBe(prev)
})

test(`get - returns different item for different key`, () => {
  const map = new FactoryMap(createGreeting)
  const prev = map.get("world")
  expect(map.get("world?")).not.toBe(prev)
})

test(`set`, () => {
  const map = new FactoryMap(createGreeting)
  const value = { greeting: "hello world" }
  map.set("world", value)
  expect(map.get("world")).toBe(value)
})

test("update - mutate item", () => {
  const map = new FactoryMap(createGreeting)

  map.update("world", (item) => {
    item.greeting = "hello moon"
  })

  expect(map.get("world")).toEqual({ greeting: "hello moon" })
})

test("update - return new item", () => {
  const map = new FactoryMap(createGreeting)

  map.update("world", () => ({ greeting: "hello moon" }))

  expect(map.get("world")).toEqual({ greeting: "hello moon" })
})

test("delete", () => {
  const map = new FactoryMap(createGreeting)
  const item = map.get("world")
  map.delete("world")
  expect(map.get("world")).not.toBe(item)
})

test("values", () => {
  const map = new FactoryMap(createGreeting)
  const a = map.get("a")
  const b = map.get("b")

  expect(map.values).toEqual([a, b])
})

test("keys", () => {
  const map = new FactoryMap(createGreeting)
  map.get("a")
  map.get("b")
  expect(map.keys).toEqual(["a", "b"])
})

test("entries", () => {
  const map = new FactoryMap(createGreeting)
  map.get("a")
  map.get("b")

  expect(map.entries).toEqual([
    ["a", { greeting: "hello a" }],
    ["b", { greeting: "hello b" }],
  ])
})
