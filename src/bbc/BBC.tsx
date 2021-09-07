import clsx from "clsx"
import type { CSSProperties } from "react"
import { Fragment, memo, useState } from "react"
import Avatar from "../character/Avatar"
import CharacterMenuTarget from "../character/CharacterMenuTarget"
import CharacterName from "../character/CharacterName"
import { memoize } from "../common/memoize"
import Button from "../dom/Button"
import { decodeHtml } from "../dom/decodeHtml"
import { getIconUrl } from "../flist/helpers"
import BBCChannelLink from "./BBCChannelLink"
import BBCLink from "./BBCLink"
import { getNodeChildrenAsText, interpret } from "./interpreter"
import type { Node } from "./types"

type Props = {
  text: string
}

const createBbcTreeMemoized = memoize(interpret)

export default memo(function BBC({ text }: Props) {
  const nodes = createBbcTreeMemoized(text)
  return <BBCTree nodes={nodes} />
})

function BBCTree({ nodes }: { nodes: Node[] }) {
  const renderNode = (node: Node): JSX.Element => {
    if (node.type === "text") {
      return <span dangerouslySetInnerHTML={{ __html: node.text }} />
    }

    switch (node.tag) {
      case "b":
        return (
          <strong className={`font-medium`}>
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
          <span className={`line-through`}>
            <BBCTree nodes={node.children} />
          </span>
        )

      case "sup":
        return (
          <span className={`text-xs align-top`}>
            <BBCTree nodes={node.children} />
          </span>
        )

      case "sub":
        return (
          <span className={`text-xs`}>
            <BBCTree nodes={node.children} />
          </span>
        )

      case "color":
        return (
          <span style={colorStyles[node.value] ?? {}}>
            <BBCTree nodes={node.children} />
          </span>
        )

      case "url": {
        return (
          <BBCLink url={decodeHtml(node.value)}>
            {node.children.length > 0 ? (
              <BBCTree nodes={node.children} />
            ) : (
              <span dangerouslySetInnerHTML={{ __html: node.value }} />
            )}
          </BBCLink>
        )
      }

      case "icon": {
        const characterName = getNodeChildrenAsText(node)
        return (
          <CharacterMenuTarget name={characterName}>
            <Avatar name={characterName} size={10} inline />
          </CharacterMenuTarget>
        )
      }

      case "eicon": {
        const iconName = getNodeChildrenAsText(node)
        return (
          <img
            src={getIconUrl(iconName)}
            alt={iconName}
            title={iconName}
            className={`inline w-10 h-10`}
          />
        )
      }

      case "user": {
        const name = getNodeChildrenAsText(node)
        return <CharacterName name={name} statusDot="hidden" />
      }

      case "channel": {
        const channelId = getNodeChildrenAsText(node)
        return (
          <BBCChannelLink
            channelId={channelId}
            title={channelId}
            type="public"
          />
        )
      }

      case "session": {
        // some links could come with a case-insensitive "adh" at the start
        // need to replace it so it doesn't clash with the rest of our uppercased IDs
        const channelId = getNodeChildrenAsText(node).replace(/^adh/i, "ADH")
        const title = node.value
        return (
          <BBCChannelLink channelId={channelId} title={title} type="private" />
        )
      }

      case "noparse":
        return <>{getNodeChildrenAsText(node)}</>

      case "spoiler":
        return (
          <BBCSpoiler>
            <BBCTree nodes={node.children} />
          </BBCSpoiler>
        )

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

  return (
    <span className={`whitespace-pre-wrap`}>
      {nodes.map((node, index) => (
        <Fragment key={index}>{renderNode(node)}</Fragment>
      ))}
    </span>
  )
}

function BBCSpoiler({ children }: { children: React.ReactNode }) {
  const [revealed, setRevealed] = useState(false)

  return (
    <span
      className={clsx(
        "relative inline-block rounded",
        revealed && `bg-white/10`,
      )}
    >
      <span aria-hidden={!revealed}>{children}</span>
      <Button
        className={clsx(
          "absolute inset-0 w-full bg-gray-900 border-1  hover:bg-gray-800  rounded transition-all",
          revealed ? "invisible opacity-0" : "visible opacity-100",
        )}
        onClick={() => setRevealed(!revealed)}
        title="Reveal Spoiler"
      />
    </span>
  )
}

const colorStyles: { [color in string]?: CSSProperties } = {
  // white and black are hardly indistinguishable from the non-colored variants,
  // and black is unreadable,
  // so we'll give them background shades
  black: {
    color: "rgb(255, 255, 255)",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: "2px",
    margin: "-2px",
    borderRadius: "2px",
  },
  white: {
    color: "rgb(15, 15, 15)",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    padding: "2px",
    margin: "-2px",
    borderRadius: "2px",
  },
  gray: { color: "rgb(149, 165, 166)" },
  red: { color: "hsl(0 87% 68% / 1)" },
  blue: { color: "hsl(204 70% 56% / 1)" },
  yellow: { color: "rgb(241, 196, 15)" },
  green: { color: "rgb(46, 204, 113)" },
  pink: { color: "rgb(255,164,156)" },
  orange: { color: "rgb(230, 126, 34)" },
  purple: { color: "rgb(201,135,228)" },
  brown: { color: "hsl(22deg 56% 60%)" },
  cyan: { color: "hsl(200 80% 67% / 1)" },
}
