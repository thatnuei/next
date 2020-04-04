import * as v from "./index"

test("number", () => {
  expect(v.number.parse(0)).toBe(0)
  expect(v.number.parse(123)).toBe(123)
  expect(v.number.parse(-0)).toBe(-0)
  expect(v.number.parse(NaN)).toBe(NaN)
  expect(v.number.parse(Infinity)).toBe(Infinity)

  expect(() => v.number.parse(true)).toThrow()
  expect(() => v.number.parse(false)).toThrow()
  expect(() => v.number.parse("123")).toThrow()
  expect(() => v.number.parse({})).toThrow()
})

test("string", () => {
  expect(v.string.parse("")).toBe("")
  expect(v.string.parse("hello")).toBe("hello")

  expect(() => v.string.parse(true)).toThrow()
  expect(() => v.string.parse(false)).toThrow()
  expect(() => v.string.parse(0)).toThrow()
  expect(() => v.string.parse(999)).toThrow()
  expect(() => v.string.parse(NaN)).toThrow()
  expect(() => v.string.parse({})).toThrow()
})

test("boolean", () => {
  expect(v.boolean.parse(true)).toBe(true)
  expect(v.boolean.parse(false)).toBe(false)

  expect(() => v.boolean.parse("true")).toThrow()
  expect(() => v.boolean.parse("false")).toThrow()
  expect(() => v.boolean.parse(undefined)).toThrow()
  expect(() => v.boolean.parse(NaN)).toThrow()
  expect(() => v.boolean.parse([])).toThrow()
  expect(() => v.boolean.parse("")).toThrow()
})

test("literal", () => {
  const validator = v.literal("secret")

  expect(validator.parse("secret")).toBe("secret")

  expect(() => validator.parse("nope")).toThrow()
  expect(() => validator.parse(null)).toThrow()
  expect(() => validator.parse(NaN)).toThrow()
  expect(() => validator.parse(3290453827904)).toThrow()
  expect(() => validator.parse({})).toThrow()
})

test("union", () => {
  const number = v.union(v.number)

  expect(number.parse(123)).toBe(123)

  const numberOrString = v.union(v.number, v.string)

  expect(numberOrString.parse(123)).toBe(123)
  expect(numberOrString.parse("123")).toBe("123")
  expect(() => numberOrString.parse(false)).toThrow()
  expect(() => numberOrString.parse([])).toThrow()
})

test("array", () => {
  const numberArray = v.array(v.number)
  const stringArray = v.array(v.string)

  expect(numberArray.parse([1, 2, 3])).toEqual([1, 2, 3])
  expect(stringArray.parse(["a", "b", "c"])).toEqual(["a", "b", "c"])

  expect(() => numberArray.parse([1, "2", 3])).toThrow()
  expect(() => stringArray.parse([1, "2", 3])).toThrow()
})
