import * as bbc from "bbc.js"
import React, { Fragment } from "react"
import Avatar from "../character/Avatar"
import CharacterName from "../character/CharacterName"
import { getIconUrl, getProfileUrl } from "../flist/helpers"
import Anchor from "./Anchor"
import Icon from "./Icon"
import { styled } from "./styled"

type Props = {
  text: string
}

function BBC(props: Props) {
  return <Container>{renderTree(bbc.toTree(props.text))}</Container>
}

export default React.memo(BBC)

const Container = styled.span`
  white-space: pre-line;
`

const Strike = styled.span`
  text-decoration: strike-through;
`

const Strong = styled.span`
  font-weight: 500;
`

const Sup = styled.span`
  vertical-align: top;
`

const Sub = styled.span`
  font-size: 75%;
`

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

const Color = styled.span`
  color: ${({ color }: { color: string }) => colors[color] || "inherit"};
`

const LinkIcon = styled(Icon)`
  display: inline;
  margin-right: 2px;

  svg {
    vertical-align: text-top;
    width: 1.2em !important;
  }
`

const IconImage = styled.img`
  width: 50px;
  height: 50px;
  vertical-align: middle;
  margin-bottom: 4px;
`

const IconAvatar = styled(Avatar)`
  vertical-align: middle;
  margin-bottom: 4px;
`

function renderTree(nodes: bbc.Node[]): React.ReactNode {
  return nodes.map((node, index) => {
    switch (node.type) {
      case "text":
        return (
          <span key={index} dangerouslySetInnerHTML={{ __html: node.text }} />
        )
      case "tag":
        return <Fragment key={index}>{renderTagNode(node)}</Fragment>
    }
  })
}

function renderTagNode(node: bbc.TagNode): React.ReactNode {
  switch (node.tag) {
    case "b":
      return <Strong>{renderTree(node.children)}</Strong>
    case "i":
      return <em>{renderTree(node.children)}</em>
    case "u":
      return <u>{renderTree(node.children)}</u>
    case "s":
      return <Strike>{renderTree(node.children)}</Strike>
    case "sub":
      return <Sub>{renderTree(node.children)}</Sub>
    case "sup":
      return <Sup>{renderTree(node.children)}</Sup>
    case "color":
      return <Color color={node.value}>{renderTree(node.children)}</Color>

    case "url":
      return (
        <Anchor href={node.value} target="_blank" title={getDomain(node.value)}>
          <LinkIcon icon="link" />
          {renderTree(node.children)}
        </Anchor>
      )

    case "channel":
      return (
        <>
          <LinkIcon icon="public" />
          <Anchor>{renderTree(node.children)}</Anchor>
        </>
      )

    case "session":
      return (
        <>
          <LinkIcon icon="private" />
          <Anchor>{node.value}</Anchor>
        </>
      )

    case "icon": {
      const userName = getNodeText(node)
      return (
        <a href={getProfileUrl(userName)} target="_blank">
          <IconAvatar name={userName} size={50} />
        </a>
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
      return [`[${node.tag}]`, renderTree(node.children), `[/${node.tag}]`]
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

function getDomain(urlString: string): string {
  try {
    const url = new URL(urlString)
    return url.host
  } catch {
    return ""
  }
}
