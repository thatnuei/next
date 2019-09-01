import { fireEvent, render } from "@testing-library/react"
import React from "react"
import RootStore, { RootStoreContext } from "../RootStore"
import { CharacterMenuProvider } from "./CharacterMenuContext"
import CharacterModel from "./CharacterModel"
import CharacterName from "./CharacterName"

describe("CharacterName", () => {
  const setup = () => {
    const store = new RootStore()

    store.characterStore.characters.set(
      "Testificate",
      new CharacterModel("Testificate", "Male", "online"),
    )

    return render(
      <RootStoreContext.Provider value={store}>
        <CharacterMenuProvider>
          <CharacterName name="Testificate" />
        </CharacterMenuProvider>
      </RootStoreContext.Provider>,
    )
  }

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
      expect(queryByText(pattern)).not.toBeVisible()
    })

    fireEvent.click(getByText("Testificate"))

    menuOptionPatterns.forEach((pattern) => {
      expect(queryByText(pattern)).toBeVisible()
    })

    fireEvent.click(container)

    menuOptionPatterns.forEach((pattern) => {
      expect(queryByText(pattern)).not.toBeVisible()
    })
  })
})
