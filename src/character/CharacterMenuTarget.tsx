import { AnimatePresence } from "framer-motion"
import React from "react"
import Button from "../dom/Button"
import { TagProps } from "../jsx/types"
import { usePopover } from "../ui/Popover"
import CharacterMenu from "./CharacterMenu"

type Props = { name: string } & TagProps<"button">

function CharacterMenuTarget({ name, ...props }: Props) {
  const popover = usePopover()

  const showMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    requestAnimationFrame(() => {
      popover.showAt({ x: rect.left, y: rect.top })
    })
  }

  return (
    <>
      <Button data-character={name} {...props} onClick={showMenu} />
      <AnimatePresence>
        {popover.value && <CharacterMenu name={name} {...popover.props} />}
      </AnimatePresence>
    </>
  )
}

export default CharacterMenuTarget
