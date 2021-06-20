import { Dialog, Transition } from "@headlessui/react"
import clsx from "clsx"
import { Fragment, useState } from "react"
import {
	fadedButton,
	headerText,
	raisedPanel,
	raisedPanelHeader,
} from "./components"
import FadeRiseTransition from "./FadeRiseTransition"
import FadeTransition from "./FadeTransition"
import Icon from "./Icon"
import { close } from "./icons"

type Props = {
	title: string
	children: React.ReactNode
	open?: boolean
	onOpenChange?: (open: boolean) => void
	renderTrigger?: (props: { onClick: () => void }) => void
}

export default function Modal(props: Props) {
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

					<div className="fixed inset-0 flex flex-col p-4 pointer-events-none">
						<FadeRiseTransition
							child
							className={clsx(
								raisedPanel,
								"m-auto w-full max-w-xl pointer-events-auto",
							)}
						>
							<div className={clsx(raisedPanelHeader, "relative")}>
								<Dialog.Title as="h2" className={headerText}>
									{props.title}
								</Dialog.Title>
								<button
									type="button"
									onClick={() => setOpen(false)}
									title="Close"
									className={clsx(fadedButton, `absolute right-2 self-center`)}
								>
									<Icon which={close} />
								</button>
							</div>
							{props.children}
						</FadeRiseTransition>
					</div>
				</Dialog>
			</Transition.Root>
		</>
	)
}
