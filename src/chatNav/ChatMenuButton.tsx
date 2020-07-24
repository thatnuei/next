import React from "react"
import Button from "../dom/Button"
import { useMediaQuery } from "../dom/useMediaQuery"
import { TagProps } from "../jsx/types"
import { useRootStore } from "../root/context"
import { fadedButton } from "../ui/components"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import { screenQueries } from "../ui/screens"

type Props = TagProps<"button">

function ChatMenuButton(props: Props) {
  const root = useRootStore()
  const isSmallScreen = useMediaQuery(screenQueries.small)

  return isSmallScreen ? (
    <Button
      title="Show side menu"
      css={fadedButton}
      onClick={() => root.isSideMenuVisible.set(true)}
      {...props}
    >
      <Icon which={icons.menu} />
    </Button>
  ) : null
}

export default ChatMenuButton
