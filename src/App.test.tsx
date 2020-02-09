import { fireEvent, render, wait } from "@testing-library/react"
import React from "react"
import App from "./App"

it("disallows login when empty", () => {
  const helpers = render(<App />)

  expect(helpers.getByLabelText(/username/i)).toBeEmpty()
  expect(helpers.getByLabelText(/password/i)).toBeEmpty()
  expect(helpers.getByText(/log in/i)).toBeDisabled()
})

it("shows an error if login failed", () => {
  const mockErrorMessage = "something really bad happened"

  jest.mock("./authenticate", () => ({
    async authenticate() {
      throw new Error(mockErrorMessage)
    },
  }))

  const helpers = render(<App />)

  fireEvent.input(helpers.getByLabelText(/username/i), {
    target: { value: "test" },
  })
  fireEvent.input(helpers.getByLabelText(/password/i), {
    target: { value: "test" },
  })
  fireEvent.click(helpers.getByText(/log in/i))

  wait(() => expect(helpers.queryByText(mockErrorMessage)).toBeDefined())
})
