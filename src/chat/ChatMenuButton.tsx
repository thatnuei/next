import React from "react"
import Button from "../dom/Button"
import { useMediaQuery } from "../dom/useMediaQuery"
import { TagProps } from "../jsx/types"
import { fadedButton } from "../ui/components"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import { screenQueries } from "../ui/screens"
import { useChatContext } from "./context"

type Props = TagProps<"button">

function ChatMenuButton(props: Props) {
  const { navStore } = useChatContext()
  const isSmallScreen = useMediaQuery(screenQueries.small)

  const handleClick = () => {
    navStore.sideMenu.show()
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
