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
		`relative px-2 text-sm transition-all`,
		status === "clear"
			? [`h-0 opacity-0`, { transitionDelay: "0.3s" }]
			: `h-7 opacity-50`,
	)

	return (
		<div className={`${containerStyle} ${className}`} {...props}>
			<div className={statusTextStyle(status === "typing")}>
				<div className={tw`mr-1 ${bounceAnimation}`}>
					<Icon which={pencil} size="small" />
				</div>
				<span>{name} is typing...</span>
			</div>
			<div className={statusTextStyle(status === "paused")}>
				<div className={tw`mr-1`}>
					<Icon which={pencil} size="small" />
				</div>
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

const statusTextStyle = (visible: boolean) =>
	tw(
		`absolute flex flex-row items-center h-full transition-all`,
		visible
			? [`opacity-100`, { transitionDelay: "0.3s" }]
			: `transform -translate-y-1 opacity-0`,
	)
