import React, { useRef } from "react"
import { act, fireEvent, render } from "react-testing-library"
import useContextMenu from "./useContextMenu"

test("useContextMenu", () => {
  let actions!: ReturnType<typeof useContextMenu>

  const Test = () => {
    const menuRef = useRef<HTMLMenuElement>(null)
    actions = useContextMenu(menuRef)

    return (
      <>
        <button onClick={actions.handleTargetClick}>first target</button>
        <button onClick={actions.handleTargetClick}>second target</button>
        <button>other</button>
        <menu ref={menuRef}>menu</menu>
      </>
    )
  }

  const { getByText, queryByText } = render(<Test />)

  // should be initially hidden
  expect(queryByText("menu")).not.toBeVisible()

  // open when clicking a target
  fireEvent.click(getByText("first target"))
  expect(queryByText("menu")).toBeVisible()

  // stay open when clicking another target
  fireEvent.click(getByText("second target"))
  expect(queryByText("menu")).toBeVisible()

  // close when clicked outside
  fireEvent.click(getByText("other"))
  expect(queryByText("menu")).not.toBeVisible()

  // manual actions test
  act(() => {
    actions.open(getByText("first target"))
  })
  expect(queryByText("menu")).toBeVisible()

  act(() => {
    actions.close()
  })
  expect(queryByText("menu")).not.toBeVisible()
})
