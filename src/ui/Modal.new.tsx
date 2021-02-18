import constate from "constate"
import { cloneElement, ReactElement, ReactNode, useMemo } from "react"
import {
	Dialog,
	DialogBackdrop,
	DialogDisclosure,
	useDialogState,
} from "reakit"
import { apply, tw } from "twind"
import { css } from "twind/css"
import Button from "../dom/Button"
import { fadedButton, raisedPanelHeader } from "./components"
import Icon from "./Icon"
import { close } from "./icons"

const [ModalProvider, useModalContext] = constate(() => {
	const dialog = useDialogState({ modal: true, animated: true })
	const buttonId = useMemo(() => `modal-button-${Math.random()}`, [])
	return { dialog, buttonId }
})

export default function Modal({ children }: { children: ReactNode }) {
	return <ModalProvider>{children}</ModalProvider>
}

export function ModalButton({ children }: { children: ReactElement }) {
	const { dialog, buttonId } = useModalContext()
	return (
		<DialogDisclosure {...dialog}>
			{(disclosure) => cloneElement(children, { ...disclosure, id: buttonId })}
		</DialogDisclosure>
	)
}

export function ModalPanel({
	children,
	title,
}: {
	children: ReactNode
	title: ReactNode
}) {
	const { dialog, buttonId } = useModalContext()
	return (
		<DialogBackdrop
			{...dialog}
			className={tw`
				fixed inset-0 flex flex-col p-4 bg-black bg-opacity-75
				transition-opacity duration-300
				opacity-0
				${css({ "&[data-enter]": apply`opacity-100` })}
			`}
		>
			<Dialog
				{...dialog}
				className={tw`
					w-full h-full max-w-screen-md mx-auto shadow
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
			</Dialog>
		</DialogBackdrop>
	)
}
