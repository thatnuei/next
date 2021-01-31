import { css, keyframes } from "@emotion/react"
import tw from "twin.macro"
import { TagProps } from "../jsx/types"
import Icon from "../ui/Icon"
import { pencil } from "../ui/icons"
import { TypingStatus } from "./types"

type Props = {
	name: string
	status: TypingStatus
} & TagProps<"div">

function TypingStatusDisplay({ name, status, ...props }: Props) {
	const containerStyle = [
		tw`relative px-2 text-sm transition-all duration-300`,
		status === "clear"
			? [tw`h-0 opacity-0`, { transitionDelay: "0.3s" }]
			: tw`h-6 opacity-50`,
	]

	return (
		<div css={containerStyle} {...props}>
			<div css={statusTextStyle(status === "typing")}>
				<Icon which={pencil} css={[iconStyle, bounceAnimation]} />
				<span>{name} is typing...</span>
			</div>
			<div css={statusTextStyle(status === "paused")}>
				<Icon which={pencil} css={iconStyle} />
				<span>{name} has typed something</span>
			</div>
		</div>
	)
}

export default TypingStatusDisplay

const rise = keyframes({
	from: { transform: `translateY(0)` },
	to: { transform: `translateY(-3px)` },
})

const bounceAnimation = css`
	animation: ${rise} 0.5s alternate infinite;
	animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
`

const iconStyle = tw`w-4 h-4 mr-1`

const statusTextStyle = (visible: boolean) => [
	tw`absolute flex flex-row items-center h-full transition-all duration-300`,
	visible
		? [tw`opacity-100`, { transitionDelay: "0.3s" }]
		: [tw`transform -translate-y-1 opacity-0`],
]
