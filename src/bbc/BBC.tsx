import type { CSSProperties, PropsWithChildren } from "react"
import { Fragment, memo } from "react"
import { useChannelUserCount } from "../channelBrowser/state"
import Avatar from "../character/Avatar"
import CharacterMenuTarget from "../character/CharacterMenuTarget"
import CharacterName from "../character/CharacterName"
import { memoize } from "../common/memoize"
import ExternalLink from "../dom/ExternalLink"
import { getIconUrl } from "../flist/helpers"
import { useRootStore } from "../root/context"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import { createBbcTree, getNodeChildrenAsText } from "./helpers"
import type { Node } from "./types"

interface Props {
	text: string
}

const createBbcTreeMemoized = memoize(createBbcTree)

function BBC({ text }: Props) {
	const nodes = createBbcTreeMemoized(text)
	return <BBCTree nodes={nodes} />
}

export default memo(BBC)

function BBCTree({ nodes }: { nodes: Node[] }) {
	const renderNode = (node: Node): JSX.Element => {
		if (node.type === "text") {
			return <span dangerouslySetInnerHTML={{ __html: node.text }} />
		}

		switch (node.tag) {
			case "b":
				return (
					<strong className={`font-bold`}>
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
					<span style={colorStyles[node.value]}>
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
					<CharacterMenuTarget name={characterName}>
						<Avatar name={characterName} className={`inline w-10 h-10`} />
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
				return <CharacterName name={name} />
			}

			case "channel": {
				const channelId = getNodeChildrenAsText(node)
				return <BBCChannelLink id={channelId} title={channelId} type="public" />
			}

			case "session": {
				// some links could come with a case-insensitive "adh" at the start
				// need to replace it so it doesn't clash with the rest of our uppercased IDs
				const channelId = getNodeChildrenAsText(node).replace(/^adh/i, "ADH")
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

	return (
		<span className={`whitespace-pre-wrap`}>
			{nodes.map((node, index) => (
				<Fragment key={index}>{renderNode(node)}</Fragment>
			))}
		</span>
	)
}

function BBCLink({ url, children }: PropsWithChildren<{ url: string }>) {
	const domain = (() => {
		try {
			const { host } = new URL(url)
			return host
		} catch {
			return undefined
		}
	})()

	return (
		<span className={`inline-flex items-baseline`}>
			<span className={`self-center inline opacity-75 mr-0.5`}>
				<Icon which={icons.link} />
			</span>
			<ExternalLink href={url} className="group">
				<span className={`underline group-hover:no-underline`}>{children}</span>
				{domain && <span className={`ml-1 text-sm`}>[{domain}] </span>}
			</ExternalLink>
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
	const root = useRootStore()
	const userCount = useChannelUserCount(id)

	return (
		<span className={`inline-flex items-baseline`}>
			<span className={`self-center inline w-4 h-4 mr-1 opacity-75`}>
				<Icon which={type === "public" ? icons.earth : icons.lock} />
			</span>
			<button
				className="group"
				onClick={() => root.channelStore.join(id, title)}
			>
				<span className={`underline group-hover:no-underline`}>{title}</span>{" "}
				<span>({userCount})</span>
			</button>
		</span>
	)
}

// TODO: make this look better while still letting gray/black be visible
const darkColorShadow = "0px 0px 2px rgba(255, 255,255, 0.8)"

const colorStyles: { [color in string]?: CSSProperties } = {
	white: { color: "rgb(236, 240, 241)" },
	black: {
		color: "rgb(52, 73, 94)",
		textShadow: darkColorShadow,
	},
	gray: {
		color: "rgb(149, 165, 166)",
	},
	red: { color: "rgb(236, 93, 93)" },
	blue: { color: "rgb(52, 152, 219)" },
	yellow: { color: "rgb(241, 196, 15)" },
	green: { color: "rgb(46, 204, 113)" },
	pink: { color: "rgb(255,164,156)" },
	orange: { color: "rgb(230, 126, 34)" },
	purple: { color: "rgb(201,135,228)" },
	brown: { color: "rgb(211, 84, 0)" },
	cyan: { color: "rgb(85, 175, 236)" },
}
