import { fadedButton } from "../ui/components"

export interface ChatNavActionProps {
	name: string
	icon: React.ReactNode
}

export default function ChatNavAction({ name, icon }: ChatNavActionProps) {
	return (
		<div title={name} className={`${fadedButton} block p-3`}>
			{icon}
		</div>
	)
}
