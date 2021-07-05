import { Portal } from "@headlessui/react"
import { useRemoveToast, useToastInstances } from "./state"
import ToastCard from "./ToastCard"

export default function ToastListOverlay() {
	const instances = useToastInstances()
	const removeToast = useRemoveToast()

	return (
		<Portal>
			<div className="fixed inset-0 z-10 flex flex-col items-center gap-4 p-4 pointer-events-none">
				{instances.map(({ key, ...toast }) => (
					<div className="pointer-events-auto" key={key}>
						<ToastCard {...toast} onDismissed={() => removeToast(key)} />
					</div>
				))}
			</div>
		</Portal>
	)
}
