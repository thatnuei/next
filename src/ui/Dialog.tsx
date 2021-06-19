import * as RadixDialog from "@radix-ui/react-dialog"
import { Slot } from "@radix-ui/react-slot"
import { ReactElement, ReactNode } from "react"
import { apply } from "twind"
import { css } from "twind/css"
import { fadedButton, raisedPanelHeader } from "./components"
import { radixTransition } from "./helpers"
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
		<RadixDialog.Overlay
			tw={[
				`fixed inset-0 bg-black bg-opacity-75 transition-opacity`,
				radixTransition({ start: apply`opacity-0`, end: apply`opacity-100` }),
			]}
		/>
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
				tw={`
					flex flex-col p-4 
					fixed inset-0
					${radixTransition({ start: apply`opacity-0`, end: apply`opacity-100` })}
				`}
				style={{ pointerEvents: "none" }}
			>
				<div
					tw={`
						flex flex-col
						m-auto
						w-full h-full max-w-screen-sm
						bg-midnight-0 shadow
						pointer-events-auto
						${radixTransition({
							start: css({ transform: `scale(0.95)` }),
							end: css({ transform: `scale(1)` }),
						})}
					`}
				>
					<h2
						tw={`${raisedPanelHeader} font-condensed text-2xl text-center relative`}
					>
						{title}
						<RadixDialog.Close
							tw={`${fadedButton} absolute right-0 self-center p-3`}
						>
							<Icon which={close} />
						</RadixDialog.Close>
					</h2>
					<div tw="flex-1">{children}</div>
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
				tw={`
					fixed inset-y-0 shadow bg-midnight-2 w-max
					${side}-0
					${radixTransition({
						start: css({
							opacity: 0,
							transform: `translateX(${side === "left" ? -100 : 100}%)`,
						}),
						end: css({ opacity: 1, transform: `translateX(0)` }),
					})}
				`}
			>
				{children}
			</RadixDialog.Content>
		</>
	)
}
