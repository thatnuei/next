import React from "react"
import tw from "twin.macro"
import ExternalLink from "../dom/ExternalLink"
import Icon from "./Icon"

type Props = {
  icon: string
  text: string
} & ({ href: string } | { onClick: () => void })

const itemStyle = tw`flex flex-row p-2 transition duration-300 opacity-50 hover:opacity-100`

export default function MenuItem(props: Props) {
  const content = (
    <>
      <Icon which={props.icon} />
      <span css={tw`ml-2`}>{props.text}</span>
    </>
  )

  return "onClick" in props ? (
    <button css={itemStyle} onClick={props.onClick}>
      {content}
    </button>
  ) : (
    <ExternalLink css={itemStyle} href={props.href}>
      {content}
    </ExternalLink>
  )
}
