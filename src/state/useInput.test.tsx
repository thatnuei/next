import React from "react"
import { fireEvent, render } from "react-testing-library"
import useInput from "./useInput"

test("useInput", () => {
  let input!: ReturnType<typeof useInput>

  const Test = () => {
    input = useInput()
    return <input {...input.bind} />
  }

  const { queryByValue, getByValue } = render(<Test />)

  expect(queryByValue("")).not.toBeNull()

  input.setValue("hi")

  expect(queryByValue("hi")).not.toBeNull()

  fireEvent.change(getByValue("hi"), { target: { value: "awesome" } })

  expect(input.value).toBe("awesome")
})
