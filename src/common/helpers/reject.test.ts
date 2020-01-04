import { reject } from "./reject"

describe("reject", () => {
  it("should exclude items where the predicate returns true", () => {
    expect(reject([1, 2, 3], (it) => it === 2)).toEqual([1, 3])
  })
})
