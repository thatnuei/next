import React, { useState } from "react"
import { render } from "react-testing-library"
import useInstanceValue from "./useInstanceValue"

test("keeps the same reference between renders", () => {
  let value!: { a: number }
  let rerender!: () => void

  const Test = () => {
    value = useInstanceValue(() => ({ a: 123 }))

    const [, setBool] = useState(false)
    rerender = () => setBool((v) => !v)

    return null
  }

  render(<Test />)
  expect(value.a).toBe(123)

  let prev = value
  rerender()
  expect(value).toBe(prev)
})
