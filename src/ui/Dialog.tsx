import constate from "constate"
import { cloneElement, ReactElement, ReactNode, useMemo } from "react"
import * as reakit from "reakit"
import { apply, tw } from "twind"
import { css } from "twind/css"
import Button from "../dom/Button"
import { fadedButton, raisedPanelHeader } from "./components"
import Icon from "./Icon"
import { close } from "./icons"

const [DialogProvider, useDialogContext] = constate(() => {
	const dialog = reakit.useDialogState({ modal: true, animated: true })
	const buttonId = useMemo(() => `dialog-button-${Math.random()}`, [])
	return { dialog, buttonId }
})

export default function Dialog({ children }: { children: ReactNode }) {
	return <DialogProvider>{children}</DialogProvider>
}

export function DialogButton({ children }: { children: ReactElement }) {
	const { dialog, buttonId } = useDialogContext()
	return (
		<reakit.DialogDisclosure {...dialog}>
			{(disclosure) => cloneElement(children, { ...disclosure, id: buttonId })}
		</reakit.DialogDisclosure>
	)
}

export function DialogShade({ children }: { children: ReactNode }) {
	const { dialog } = useDialogContext()
	return (
		<reakit.DialogBackdrop
			{...dialog}
			className={tw`
				fixed inset-0 bg-black bg-opacity-75
				transition-opacity duration-300
				opacity-0
				${css({ "&[data-enter]": apply`opacity-100` })}
			`}
		>
			{children}
		</reakit.DialogBackdrop>
	)
}

export function DialogModalPanel({
	children,
	title,
}: {
	children: ReactNode
	title: ReactNode
}) {
	const { dialog, buttonId } = useDialogContext()
	return (
		<DialogShade>
			<div className={tw`flex flex-col w-full h-full p-4 overflow-y-auto`}>
				<reakit.Dialog
					{...dialog}
					className={tw`
						bg-midnight-0
						w-full max-w-screen-md m-auto shadow
						flex flex-col
						transition-transform duration-300
						transform origin-top scale-95
						${css({ "&[data-enter]": apply`scale-100` })}
					`}
					aria-labelledby={buttonId}
				>
					<h2
						className={tw`${raisedPanelHeader} font-condensed text-2xl relative flex`}
					>
						{title}
						<Button
							className={tw`${fadedButton} absolute right-0 self-center p-3`}
							onClick={() => dialog.hide()}
						>
							<Icon which={close} />
						</Button>
					</h2>
					<div className={tw`flex-1`}>{children}</div>
				</reakit.Dialog>
			</div>
		</DialogShade>
	)
}

export function DialogDrawerPanel({ children }: { children: ReactNode }) {
	const { dialog, buttonId } = useDialogContext()
	return (
		<DialogShade>
			<reakit.Dialog
				{...dialog}
				className={tw`
					bg-midnight-2 h-full w-max shadow
					transition-transform duration-300
					transform -translate-x-full
					${css({ "&[data-enter]": apply`translate-x-0` })}
				`}
				aria-labelledby={buttonId}
			>
				{children}
			</reakit.Dialog>
		</DialogShade>
	)
}
