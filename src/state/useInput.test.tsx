import { act, fireEvent, render } from "@testing-library/react"
import React from "react"
import useInput from "./useInput"

test("useInput", () => {
  let input!: ReturnType<typeof useInput>

  const Test = () => {
    input = useInput()
    return <input {...input.bind} />
  }

  const { queryByDisplayValue, getByDisplayValue } = render(<Test />)

  expect(queryByDisplayValue("")).not.toBeNull()

  act(() => {
    input.setValue("hi")
  })

  expect(queryByDisplayValue("hi")).not.toBeNull()

  act(() => {
    fireEvent.change(getByDisplayValue("hi"), { target: { value: "awesome" } })
  })

  expect(input.value).toBe("awesome")
})
