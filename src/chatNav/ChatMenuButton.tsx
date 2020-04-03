import React from "react"
import { useChatContext } from "../chat/context"
import Button from "../dom/Button"
import { useMediaQuery } from "../dom/useMediaQuery"
import { TagProps } from "../jsx/types"
import { fadedButton } from "../ui/components"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import { screenQueries } from "../ui/screens"

type Props = TagProps<"button">

function ChatMenuButton(props: Props) {
  const { state } = useChatContext()
  const isSmallScreen = useMediaQuery(screenQueries.small)

  const handleClick = () => {
    state.sideMenuOverlay.show()
  }

  return isSmallScreen ? (
    <Button
      title="Show side menu"
      css={fadedButton}
      onClick={handleClick}
      {...props}
    >
      <Icon which={icons.menu} />
    </Button>
  ) : null
}

export default ChatMenuButton
