import React from "react"
import { act, fireEvent, render } from "react-testing-library"
import useInput from "./useInput"

test("useInput", () => {
  let input!: ReturnType<typeof useInput>

  const Test = () => {
    input = useInput()
    return <input {...input.bind} />
  }

  const { queryByValue, getByValue } = render(<Test />)

  expect(queryByValue("")).not.toBeNull()

  act(() => {
    input.setValue("hi")
  })

  expect(queryByValue("hi")).not.toBeNull()

  act(() => {
    fireEvent.change(getByValue("hi"), { target: { value: "awesome" } })
  })

  expect(input.value).toBe("awesome")
})
