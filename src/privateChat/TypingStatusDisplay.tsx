import { tw } from "twind"
import { css, keyframes } from "twind/css"
import { TagProps } from "../jsx/types"
import Icon from "../ui/Icon"
import { pencil } from "../ui/icons"
import { TypingStatus } from "./types"

type Props = {
	name: string
	status: TypingStatus
} & TagProps<"div">

function TypingStatusDisplay({ name, status, className, ...props }: Props) {
	const containerStyle = tw(
		tw`relative px-2 text-sm transition-all`,
		status === "clear"
			? [tw`h-0 opacity-0`, { transitionDelay: "0.3s" }]
			: tw`h-6 opacity-50`,
	)

	return (
		<div className={`${containerStyle} ${className}`} {...props}>
			<div className={statusTextStyle(status === "typing")}>
				<Icon which={pencil} className={tw([iconStyle, bounceAnimation])} />
				<span>{name} is typing...</span>
			</div>
			<div className={statusTextStyle(status === "paused")}>
				<Icon which={pencil} className={iconStyle} />
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

const statusTextStyle = (visible: boolean) =>
	tw(
		tw`absolute flex flex-row items-center h-full transition-all`,
		visible
			? [tw`opacity-100`, { transitionDelay: "0.3s" }]
			: [tw`transform -translate-y-1 opacity-0`],
	)
