import React from "react"
import { render } from "react-testing-library"
import CharacterName from "./CharacterName"

describe("CharacterName", () => {
  const setup = () =>
    render(<CharacterName name="Testificate" gender="Male" status="online" />)

  it("renders the character name", () => {
    const { queryByText } = setup()
    expect(queryByText(/testificate/i)).not.toBeNull()
  })

  it("has accessible status", () => {
    const { queryByTitle } = setup()
    expect(queryByTitle(/online/i)).not.toBeNull()
  })

  it("has accessible gender", () => {
    const { queryByTitle } = setup()
    expect(queryByTitle(/male/i)).not.toBeNull()
  })
})
