import Button from "../ui/Button"
import { alertIcon, closeCircleIcon } from "../ui/icons"
import { useToastContext } from "./ToastContext"

export default function ToastListOverlay() {
	const { toasts, removeToast } = useToastContext()

	return (
		<div className="fixed inset-x-0 top-0 flex flex-col items-center p-4 space-y-4">
			{toasts.map(({ key, text }) => (
				<div
					key={key}
					className="flex items-center max-w-sm p-2 text-white bg-red-800 shadow"
					role="alert"
				>
					<div>{alertIcon}</div>
					<div className="ml-2">{text}</div>
					<Button
						className="ml-3"
						aria-label="Dismiss"
						onClick={() => removeToast(key)}
					>
						{closeCircleIcon}
					</Button>
				</div>
			))}
		</div>
	)
}
