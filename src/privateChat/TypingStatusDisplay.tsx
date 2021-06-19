import { TagProps } from "../jsx/types"
import Icon from "../ui/Icon"
import { pencil } from "../ui/icons"
import { TypingStatus } from "./types"

type Props = {
	name: string
	status: TypingStatus
} & TagProps<"div">

function TypingStatusDisplay({ name, status, className, ...props }: Props) {
	const containerClass = `relative px-2 text-sm transition-all`

	const clearClass =
		status === "clear" ? `h-0 opacity-0 transition-delay-300` : `h-7 opacity-50`

	return (
		<div className={`${containerClass} ${clearClass} ${className}`} {...props}>
			<div className={statusTextStyle(status === "typing")}>
				<div className={`mr-1 bounce-animation`}>
					<Icon which={pencil} />
				</div>
				<span>{name} is typing...</span>
			</div>
			<div className={statusTextStyle(status === "paused")}>
				<div className={`mr-1`}>
					<Icon which={pencil} />
				</div>
				<span>{name} has typed something</span>
			</div>
		</div>
	)
}

export default TypingStatusDisplay

const statusTextStyle = (visible: boolean) =>
	`absolute flex flex-row items-center h-full transition-all ${
		visible
			? `opacity-100 transition-delay-300`
			: `transform -translate-y-1 opacity-0`
	}`
