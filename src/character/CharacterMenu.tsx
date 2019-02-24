import React from "react"

type CharacterMenuProps = {}

const CharacterMenu = (
  props: CharacterMenuProps,
  ref: React.Ref<HTMLDivElement>,
) => {
  return <div ref={ref}>hi</div>
}

export default React.forwardRef(CharacterMenu)
