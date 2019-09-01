import * as bbc from "bbc.js"
import React from "react"
import CharacterName from "../character/CharacterName"
import { getIconUrl, getProfileUrl } from "../flist/helpers"
import Anchor from "../ui/Anchor"
import ExternalLink from "../ui/ExternalLink"
import BBCTree from "./BBCTree"
import ChannelLink from "./ChannelLink"
import {
  Color,
  IconAvatar,
  IconImage,
  LinkIcon,
  Strike,
  Strong,
  Sub,
  Sup,
} from "./styles"

export default function BBCTagNode({ node }: { node: bbc.TagNode }) {
  const childrenTree = <BBCTree key="children" nodes={node.children} />

  switch (node.tag) {
    case "b":
      return <Strong>{childrenTree}</Strong>
    case "i":
      return <em>{childrenTree}</em>
    case "u":
      return <u>{childrenTree}</u>
    case "s":
      return <Strike>{childrenTree}</Strike>
    case "sub":
      return <Sub>{childrenTree}</Sub>
    case "sup":
      return <Sup>{childrenTree}</Sup>
    case "color":
      return <Color color={node.value}>{childrenTree}</Color>

    case "url":
      return (
        <Anchor href={node.value} target="_blank" title={getDomain(node.value)}>
          <LinkIcon icon="link" />
          {childrenTree}
        </Anchor>
      )

    case "channel": {
      const id = getNodeText(node)
      return <ChannelLink id={id} title={id} icon="public" />
    }

    case "session": {
      // i hate this
      const id = getNodeText(node)
      const title = node.value
      return <ChannelLink id={id} title={title} icon="private" />
    }

    case "icon": {
      const userName = getNodeText(node)
      return (
        <ExternalLink href={getProfileUrl(userName)}>
          <IconAvatar name={userName} size={50} />
        </ExternalLink>
      )
    }

    case "user": {
      return <CharacterName name={getNodeText(node)} />
    }

    case "eicon": {
      const iconName = getNodeText(node)
      return (
        <IconImage
          src={getIconUrl(iconName)}
          alt={`Image for icon "${iconName}"`}
          title={iconName}
        />
      )
    }

    default:
      return [`[${node.tag}]`, childrenTree, `[/${node.tag}]`] as any
  }
}

function getDomain(urlString: string): string {
  try {
    const url = new URL(urlString)
    return url.host
  } catch {
    return ""
  }
}

function getNodeText(node: bbc.TagNode): string {
  const first = node.children[0]
  if (!first) {
    return ""
  }
  if (first.type !== "text") {
    return getNodeText(first)
  }
  return first.text
}
