import React from "react"
import { useSetRecoilState } from "recoil"
import { sideMenuVisibleAtom } from "../chat/state"
import Button from "../dom/Button"
import { useMediaQuery } from "../dom/useMediaQuery"
import { TagProps } from "../jsx/types"
import { fadedButton } from "../ui/components"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import { screenQueries } from "../ui/screens"

type Props = TagProps<"button">

function ChatMenuButton(props: Props) {
  const isSmallScreen = useMediaQuery(screenQueries.small)
  const setSideMenuVisible = useSetRecoilState(sideMenuVisibleAtom)

  return isSmallScreen ? (
    <Button
      title="Show side menu"
      css={fadedButton}
      onClick={() => setSideMenuVisible(true)}
      {...props}
    >
      <Icon which={icons.menu} />
    </Button>
  ) : null
}

export default ChatMenuButton
