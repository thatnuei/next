import React from "react"
import tw from "twin.macro"
import Button from "../dom/Button"
import { useMediaQuery } from "../dom/useMediaQuery"
import { fadedButton } from "../ui/components"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import { screenQueries } from "../ui/screens"

type Props = {}

function ChatMenuButton(props: Props) {
  const isSmallScreen = useMediaQuery(screenQueries.small)

  return isSmallScreen ? (
    <>
      <Button title="Show side menu" css={[fadedButton, tw`mr-3`]}>
        <Icon which={icons.menu} />
      </Button>
      {/* TODO: menu drawer */}
    </>
  ) : null
}

export default ChatMenuButton
