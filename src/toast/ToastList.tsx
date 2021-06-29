import { useRemoveToast, useToastInstances } from "./state"
import ToastCard from "./ToastCard"

export default function ToastList() {
	const instances = useToastInstances()
	const removeToast = useRemoveToast()

	return (
		<div className="fixed inset-0 flex flex-col items-center gap-4 p-4 pointer-events-none">
			{instances.map(({ key, ...toast }) => (
				<div className="pointer-events-auto" key={key}>
					<ToastCard {...toast} onDismissed={() => removeToast(key)} />
				</div>
			))}
		</div>
	)
}
