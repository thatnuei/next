import { fireEvent } from "@testing-library/react"
import React from "react"
import { renderWithProviders } from "../test/renderWithProviders"
import CharacterSelect from "./CharacterSelect"

describe("CharacterSelect", () => {
  it("starts with the initial character and calls submit with the chosen character", () => {
    const characters = ["alli", "reiko", "subaru"]
    const initialCharacter = characters[2]
    const handleSubmit = jest.fn()

    const helpers = renderWithProviders(
      <CharacterSelect
        characters={characters}
        initialCharacter={initialCharacter}
        onSubmit={handleSubmit}
        onReturnToLogin={() => {}}
      />,
    )

    const select = helpers.getByDisplayValue(initialCharacter)
    if (!(select instanceof HTMLSelectElement)) fail("element is not a select")

    fireEvent.change(select, { target: { value: characters[0] } })
    expect(select.value).toBe(characters[0])
    fireEvent.change(select, { target: { value: characters[1] } })
    expect(select.value).toBe(characters[1])

    fireEvent.click(helpers.getByText(/enter chat/i))

    expect(handleSubmit).toHaveBeenCalledWith(characters[1])
  })
})
