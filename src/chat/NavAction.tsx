import React from "react"
import tw from "twin.macro"
import Button from "../dom/Button"
import { ComponentProps } from "../jsx/types"
import { fadedButton } from "../ui/components"
import Icon, { IconProps } from "../ui/Icon"

type Props = ComponentProps<typeof Button> & {
  icon: IconProps["which"]
}

export default function NavAction({ icon, ...props }: Props) {
  return (
    <Button css={[fadedButton, tw`p-3`]} {...props}>
      <Icon which={icon} css={tw`w-5 h-5`} />
    </Button>
  )
}
