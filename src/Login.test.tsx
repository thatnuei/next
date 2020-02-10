import { fireEvent, render, wait } from "@testing-library/react"
import React from "react"
import Login from "./Login"

describe("Login", () => {
  it("disallows login when empty", () => {
    const handleSuccess = jest.fn()
    const helpers = render(<Login onSuccess={handleSuccess} />)

    expect(helpers.getByLabelText(/username/i)).toBeEmpty()
    expect(helpers.getByLabelText(/password/i)).toBeEmpty()
    expect(helpers.getByText(/log in/i)).toBeDisabled()
    expect(handleSuccess).not.toHaveBeenCalled()
  })

  it("shows an error if login failed", () => {
    const mockErrorMessage = "something really bad happened"

    jest.mock("./authenticate", () => ({
      async authenticate() {
        throw new Error(mockErrorMessage)
      },
    }))

    const handleSuccess = jest.fn()
    const helpers = render(<Login onSuccess={handleSuccess} />)

    fireEvent.input(helpers.getByLabelText(/username/i), {
      target: { value: "test" },
    })
    fireEvent.input(helpers.getByLabelText(/password/i), {
      target: { value: "test" },
    })
    fireEvent.click(helpers.getByText(/log in/i))

    wait(() => expect(helpers.queryByText(mockErrorMessage)).toBeDefined())
    expect(handleSuccess).not.toHaveBeenCalled()
  })
})
