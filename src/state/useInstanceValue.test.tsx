import React from "react"
import { render } from "react-testing-library"
import useInstanceValue from "./useInstanceValue"

test("keeps the same reference between renders", () => {
  let value!: { a: number }

  const Test = () => {
    value = useInstanceValue(() => ({ a: 123 }))
    return null
  }

  const { rerender } = render(<Test />)
  expect(value.a).toBe(123)

  let prev = value
  rerender(<Test />)
  expect(value).toBe(prev)
})
