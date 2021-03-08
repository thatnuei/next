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
				tw={[
					`fixed w-full max-w-screen-sm transform -translate-x-1/2 -translate-y-1/2 shadow pointer-events-auto top-1/2 left-1/2 bg-midnight-0`,
					css(
						radixTransition({
							start: apply`opacity-0`,
							end: apply`opacity-100`,
						}),
					),
				]}
			>
				<div
					tw={css(
						radixTransition({
							start: css({ transform: `scale(0.95)` }),
							end: css({ transform: `scale(1)` }),
						}),
					)}
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

export function DialogDrawerPanel({ children }: { children: ReactNode }) {
	return (
		<>
			<DialogShade />
			<RadixDialog.Content
				tw={`
					fixed inset-y-0 left-0 shadow bg-midnight-2 w-max
					${radixTransition({
						start: css({ opacity: 0, transform: `translateX(-100%)` }),
						end: css({ opacity: 1, transform: `translateX(0)` }),
					})}
				`}
			>
				{children}
			</RadixDialog.Content>
		</>
	)
}
