import React from "react"

type CharacterMenuProps = {}

const CharacterMenu = (
  props: CharacterMenuProps,
  ref: React.Ref<HTMLDivElement>,
) => {
  return (
    <div ref={ref}>
      <button>Profile</button>
      <button>Open Private Message</button>
      <button>Bookmark</button>
      <button>Ignore</button>
      <button>Report</button>
    </div>
  )
}

export default React.forwardRef(CharacterMenu)
