import Button from "../dom/Button"
import { fadedButton } from "../ui/components"
import type { IconProps } from "../ui/Icon"
import Icon from "../ui/Icon"

interface ChatNavActionProps {
	name: string
	icon: IconProps["which"]
	onClick?: () => void
}

export function ChatNavAction({ name, icon, onClick }: ChatNavActionProps) {
	return (
		<Button
			className={`${fadedButton} block p-3`}
			title={name}
			onClick={onClick}
		>
			<Icon which={icon} />
		</Button>
	)
}
