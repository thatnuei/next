import * as RadixDialog from "@radix-ui/react-dialog"
import { Slot } from "@radix-ui/react-slot"
import { ReactElement, ReactNode } from "react"
import { fadedButton, raisedPanelHeader } from "./components"
import Icon from "./Icon"
import { close } from "./icons"

export default function Dialog({
	children,
	open,
	onOpenChange,
}: {
	children: ReactNode
	open?: boolean
	onOpenChange?: (open: boolean) => void
}) {
	return (
		<RadixDialog.Root open={open} onOpenChange={onOpenChange}>
			{children}
		</RadixDialog.Root>
	)
}

export function DialogButton({ children }: { children: ReactElement }) {
	return <RadixDialog.Trigger as={Slot}>{children}</RadixDialog.Trigger>
}

function DialogShade() {
	return (
		<RadixDialog.Overlay className="fixed inset-0 transition-opacity bg-black bg-opacity-75" />
	)
}

export function DialogModalPanel({
	children,
	title,
}: {
	children: ReactNode
	title: ReactNode
}) {
	return (
		<>
			<DialogShade />
			<RadixDialog.Content
				className={`
					flex flex-col p-4 
					fixed inset-0
					radix-animation-fade
				`}
				style={{ pointerEvents: "none" }}
			>
				<div
					className={`
						flex flex-col
						m-auto
						w-full h-full max-w-screen-sm
						bg-midnight-0 shadow
						pointer-events-auto
						radix-animation-zoom
					`}
				>
					<h2
						className={`${raisedPanelHeader} font-condensed text-2xl text-center relative`}
					>
						{title}
						<RadixDialog.Close
							className={`${fadedButton} absolute right-0 self-center p-3`}
						>
							<Icon which={close} />
						</RadixDialog.Close>
					</h2>
					<div className="flex-1">{children}</div>
				</div>
			</RadixDialog.Content>
		</>
	)
}

export function DialogDrawerPanel({
	children,
	side,
}: {
	children: ReactNode
	side: "left" | "right"
}) {
	return (
		<>
			<DialogShade />
			<RadixDialog.Content
				className={`
					fixed inset-y-0 shadow bg-midnight-2 w-max
					${side === "left" ? "left-0" : "right-0"}
				`}
			>
				{children}
			</RadixDialog.Content>
		</>
	)
}
