import clsx from "clsx"
import { headerText } from "../ui/components"
import { ScreenHeader } from "../ui/ScreenHeader"

function NoRoomView() {
  return (
    <ScreenHeader>
      <h1 className={clsx(headerText, "opacity-50")}>next</h1>
    </ScreenHeader>
  )
}

export default NoRoomView
