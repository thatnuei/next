import React, { PropsWithChildren } from "react"
import tw from "twin.macro"
import Avatar from "../character/Avatar"
import CharacterName from "../character/CharacterName"
import { useChatContext } from "../chat/context"
import ExternalLink from "../dom/ExternalLink"
import { getIconUrl, getProfileUrl } from "../flist/helpers"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import { createBbcTree, getNodeChildrenAsText } from "./helpers"
import { Node } from "./types"

type Props = { text: string }

function BBC({ text }: Props) {
  const nodes = createBbcTree(text)
  return <BBCTree nodes={nodes} />
}

export default React.memo(BBC)

function BBCTree({ nodes }: { nodes: Node[] }) {
  const { characterStore } = useChatContext()

  const renderNode = (node: Node): JSX.Element => {
    if (node.type === "text") {
      return <span dangerouslySetInnerHTML={{ __html: node.text }} />
    }

    switch (node.tag) {
      case "b":
        return (
          <strong css={tw`font-weight-bold`}>
            <BBCTree nodes={node.children} />
          </strong>
        )

      case "i":
        return (
          <em>
            <BBCTree nodes={node.children} />
          </em>
        )

      case "u":
        return (
          <u>
            <BBCTree nodes={node.children} />
          </u>
        )

      case "s":
        return (
          <span css={tw`line-through`}>
            <BBCTree nodes={node.children} />
          </span>
        )

      case "sup":
        return (
          <span css={tw`text-sm align-top`}>
            <BBCTree nodes={node.children} />
          </span>
        )

      case "sub":
        return (
          <span css={tw`text-sm`}>
            <BBCTree nodes={node.children} />
          </span>
        )

      case "color":
        return (
          <span style={{ color: colors[node.value] || "inherit" }}>
            <BBCTree nodes={node.children} />
          </span>
        )

      case "url":
        return (
          <BBCLink url={node.value}>
            <BBCTree nodes={node.children} />
          </BBCLink>
        )

      case "icon": {
        const characterName = getNodeChildrenAsText(node)
        return (
          <ExternalLink href={getProfileUrl(characterName)}>
            <Avatar name={characterName} css={tw`inline w-10 h-10`} />
          </ExternalLink>
        )
      }

      case "eicon": {
        const iconName = getNodeChildrenAsText(node)
        return (
          <img
            src={getIconUrl(iconName)}
            alt={iconName}
            title={iconName}
            css={tw`inline w-10 h-10`}
          />
        )
      }

      case "user": {
        const name = getNodeChildrenAsText(node)
        return <CharacterName character={characterStore.getCharacter(name)} />
      }

      case "channel": {
        const channelId = getNodeChildrenAsText(node)
        return <BBCChannelLink id={channelId} title={channelId} type="public" />
      }

      case "session": {
        const channelId = getNodeChildrenAsText(node)
        const title = node.value
        return <BBCChannelLink id={channelId} title={title} type="private" />
      }

      case "noparse":
        return <>{getNodeChildrenAsText(node)}</>

      default: {
        const startTagText = `[${node.tag}${
          node.value ? `=${node.value}` : ""
        }]`

        const endTagText = `[/${node.tag}]`

        return (
          <>
            {startTagText}
            <BBCTree nodes={node.children} />
            {endTagText}
          </>
        )
      }
    }
  }

  return nodes.map((node, index) => {
    const element = renderNode(node)
    return React.cloneElement(element, { key: index })
  }) as any
}

function BBCLink({ url, children }: PropsWithChildren<{ url: string }>) {
  const domain = (() => {
    try {
      const { host } = new URL(url)
      return host
    } catch {}
  })()

  return (
    <span css={tw`inline-flex items-baseline leading-none `}>
      <Icon
        which={icons.link}
        css={tw`self-center inline w-4 h-4 mr-1 opacity-75`}
      />
      <ExternalLink href={url} css={tw`underline hover:no-underline`}>
        {children}
      </ExternalLink>
      {domain && <span css={tw`ml-1 text-sm`}>[{domain}] </span>}
    </span>
  )
}

function BBCChannelLink({
  id,
  title,
  type,
}: PropsWithChildren<{
  id: string
  title: string
  type: "public" | "private"
}>) {
  const { channelStore } = useChatContext()

  const handleClick = () => {
    channelStore.join(id)
  }

  return (
    <span css={tw`inline-flex items-baseline leading-none`}>
      <Icon
        which={type === "public" ? icons.earth : icons.lock}
        css={tw`self-center inline w-4 h-4 mr-1 opacity-75`}
      />
      <button onClick={handleClick} css={tw`underline hover:no-underline`}>
        {title}
      </button>
    </span>
  )
}

const colors: { [color in string]?: string } = {
  white: "rgb(236, 240, 241)",
  black: "rgb(52, 73, 94)",
  red: "rgb(236, 93, 93)",
  blue: "rgb(52, 152, 219)",
  yellow: "rgb(241, 196, 15)",
  green: "rgb(46, 204, 113)",
  pink: "rgb(255,164,156)",
  gray: "rgb(149, 165, 166)",
  orange: "rgb(230, 126, 34)",
  purple: "rgb(201,135,228)",
  brown: "rgb(211, 84, 0)",
  cyan: "rgb(85, 175, 236)",
}
