import { fireEvent, waitFor } from "@testing-library/react"
import React from "react"
import { AuthenticateResponse, LoginCredentials } from "../flist/api.old"
import { renderWithProviders } from "../test/renderWithProviders"
import Login, { LoginResult } from "./Login"

const mockCreds: LoginCredentials = { account: "test", password: "test" }

const mockErrorMessage = "something really bad happened"

const mockAuthResponse: AuthenticateResponse = {
  characters: ["a", "b", "c"],
  ticket: "asdf",
}

jest.mock("../flist/api", () => ({
  createFListApi() {
    async function authenticate(creds: LoginCredentials) {
      if (
        creds.account === mockCreds.account &&
        creds.password === mockCreds.password
      ) {
        return mockAuthResponse
      }
      throw new Error(mockErrorMessage)
    }
    return { authenticate }
  },
}))

describe("Login", () => {
  it("disallows login when empty", () => {
    const handleSuccess = jest.fn()
    const helpers = renderWithProviders(<Login onSuccess={handleSuccess} />)

    expect(helpers.getByLabelText(/username/i)).toBeEmpty()
    expect(helpers.getByLabelText(/password/i)).toBeEmpty()
    expect(helpers.getByText(/log in/i)).toBeDisabled()
    expect(handleSuccess).not.toHaveBeenCalled()
  })

  it("shows an error if login failed", async () => {
    const handleSuccess = jest.fn()
    const helpers = renderWithProviders(<Login onSuccess={handleSuccess} />)

    fireEvent.input(helpers.getByLabelText(/username/i), {
      target: { value: "test" },
    })
    fireEvent.input(helpers.getByLabelText(/password/i), {
      target: { value: "tes" },
    })
    fireEvent.click(helpers.getByText(/log in/i))

    await waitFor(() =>
      expect(helpers.queryByText(mockErrorMessage)).toBeDefined(),
    )
    expect(handleSuccess).not.toHaveBeenCalled()
  })

  it("calls success when successful", async () => {
    const handleSuccess = jest.fn()
    const helpers = renderWithProviders(<Login onSuccess={handleSuccess} />)

    fireEvent.input(helpers.getByLabelText(/username/i), {
      target: { value: "test" },
    })
    fireEvent.input(helpers.getByLabelText(/password/i), {
      target: { value: "test" },
    })
    fireEvent.click(helpers.getByText(/log in/i))

    await waitFor(() => {
      expect(handleSuccess).toBeCalledWith<[LoginResult]>({
        ...mockAuthResponse,
        account: mockCreds.account,
      })
    })
  })
})
