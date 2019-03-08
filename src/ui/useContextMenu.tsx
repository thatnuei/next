import Popper from "popper.js"
import React, { useEffect, useMemo, useState } from "react"
import useWindowEvent from "./useWindowEvent"

export default function useContextMenu(menuRef: React.RefObject<HTMLElement>) {
  const [target, setTarget] = useState<Element>()

  useEffect(() => {
    if (!menuRef.current) return
    menuRef.current.style.display = "none"

    if (!target) return
    menuRef.current.style.display = "initial"

    const popper = new Popper(target, menuRef.current, {
      placement: "bottom-start",
    })

    return () => popper.destroy()
  }, [menuRef, target])

  useWindowEvent("click", (event) => {
    if (!menuRef.current) return
    if (menuRef.current.contains(event.target as Node)) return
    if (target) setTarget(undefined)
  })

  const actions = useMemo(
    () => ({
      open: (newTarget: Element) => {
        setTarget(newTarget)
      },
      close: () => {
        setTarget(undefined)
      },
      handleTargetClick: (event: React.MouseEvent) => {
        setTarget(event.currentTarget)

        // prevent the event frop propagating up to the window
        // without this, the close handler would trigger
        // and the menu would just close again
        event.stopPropagation()
      },
    }),
    [setTarget],
  )

  return actions
}
