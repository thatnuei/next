import * as bbc from "bbc.js"
import React from "react"
import Avatar from "../character/Avatar"
import ExternalLink from "../dom/components/ExternalLink"
import { getIconUrl, getProfileUrl } from "../flist/helpers"
import Icon from "../ui/components/Icon"
import { h, lineThrough, textSize, w, weightBold } from "../ui/helpers.new"
import BBCTree from "./BBCTree"
import ChannelLink from "./ChannelLink"
import { bbcColor, linkIcon } from "./styles"

export default function BBCTagNode({ node }: { node: bbc.TagNode }) {
  const childrenTree = <BBCTree key="children" nodes={node.children} />

  switch (node.tag) {
    case "b":
      return <strong css={weightBold}>{childrenTree}</strong>
    case "i":
      return <em>{childrenTree}</em>
    case "u":
      return <u>{childrenTree}</u>
    case "s":
      return <del css={lineThrough}>{childrenTree}</del>

    case "sub":
      return (
        <sub css={[{ verticalAlign: "unset" }, textSize("xs")]}>
          {childrenTree}
        </sub>
      )

    case "sup":
      return (
        <sup css={[{ verticalAlign: "top" }, textSize("xs")]}>
          {childrenTree}
        </sup>
      )

    case "color":
      return <span css={bbcColor(node.value)}>{childrenTree}</span>

    case "url":
      return (
        <ExternalLink
          className="anchor"
          href={node.value}
          title={getDomain(node.value)}
        >
          <Icon name="link" css={linkIcon} size={0.8} />
          {childrenTree}
        </ExternalLink>
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
          <Avatar css={{ verticalAlign: "middle" }} name={userName} size={50} />
        </ExternalLink>
      )
    }

    case "user": {
      const name = getNodeText(node)
      return name
      // return <CharacterName name={name} />
    }

    case "eicon": {
      const iconName = getNodeText(node)
      return (
        <img
          css={[{ verticalAlign: "middle" }, w(12), h(12)]}
          src={getIconUrl(iconName)}
          alt={iconName}
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
  if (!first) return ""
  if (first.type === "text") return first.text
  return getNodeText(first)
}
