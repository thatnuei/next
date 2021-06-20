import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useState } from "react"
import FadeTransition from "./FadeTransition"

export type DialogBaseProps = {
	open?: boolean
	onOpenChange?: (open: boolean) => void
	renderTrigger?: (props: { onClick: () => void }) => void
	children: (content: { setOpen: (open: boolean) => void }) => void
}

export default function DialogBase(props: DialogBaseProps) {
	const [openInternal, setOpenInternal] = useState(false)
	const open = props.open ?? openInternal
	const setOpen = props.onOpenChange ?? setOpenInternal

	return (
		<>
			{props.renderTrigger?.({ onClick: () => setOpen(true) })}
			<Transition.Root as={Fragment} show={open}>
				<Dialog onClose={setOpen}>
					<FadeTransition child>
						<Dialog.Overlay className="fixed inset-0 bg-black/75" />
					</FadeTransition>
					{props.children({ setOpen })}
				</Dialog>
			</Transition.Root>
		</>
	)
}
