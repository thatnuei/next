import queryify from "./queryify"

test("queryify", () => {
  expect(queryify("abc DeF---!g")).toBe("abcdefg")
})
