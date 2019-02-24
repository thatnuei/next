import React from "react"
import { fireEvent, render } from "react-testing-library"
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

  it("has a menu opened on click", () => {
    const { getByText, queryByText, container } = setup()

    const menuOptionPatterns = [/message/i, /profile/i, /ignore/i]

    // menu should not exist initially
    menuOptionPatterns.forEach((pattern) => {
      expect(queryByText(pattern)).toBeNull()
    })

    fireEvent.click(getByText("Testificate"))

    menuOptionPatterns.forEach((pattern) => {
      expect(queryByText(pattern)).not.toBeNull()
    })

    fireEvent.click(container)

    menuOptionPatterns.forEach((pattern) => {
      expect(queryByText(pattern)).toBeNull()
    })
  })
})
