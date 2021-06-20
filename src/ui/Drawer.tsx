import { Dialog, Transition } from "@headlessui/react"
import clsx from "clsx"
import { Fragment, useState } from "react"
import Slot from "../react/Slot"
import { fadedButton, raisedPanel } from "./components"
import { createTransitionComponent } from "./createTransitionComponent"
import FadeTransition from "./FadeTransition"
import Icon from "./Icon"
import { close } from "./icons"

type Props = {
	trigger?: React.ReactElement
	children: React.ReactNode
	open?: boolean
	side: "left" | "right"
	onOpenChange?: (open: boolean) => void
}

export default function Drawer(props: Props) {
	const [openInternal, setOpenInternal] = useState(false)
	const open = props.open ?? openInternal
	const setOpen = props.onOpenChange ?? setOpenInternal

	const SlideTransition =
		props.side === "left" ? SlideLeftTransition : SlideRightTransition

	return (
		<>
			{props.trigger ? (
				<Slot element={props.trigger} onClick={() => setOpen(true)} />
			) : null}

			<Transition.Root as={Fragment} show={open}>
				<Dialog onClose={setOpen}>
					<FadeTransition child>
						<Dialog.Overlay className="fixed inset-0 bg-black/75" />
					</FadeTransition>

					<SlideTransition
						child
						className={clsx(
							"fixed inset-0 flex items-start pointer-events-none",
							props.side === "right" && "flex-row-reverse",
						)}
					>
						<div
							className={clsx(
								raisedPanel,
								"h-full overflow-y-auto pointer-events-auto",
							)}
						>
							{props.children}
						</div>
						<button
							type="button"
							onClick={() => setOpen(false)}
							title="Close"
							className={clsx(fadedButton, "p-2 pointer-events-auto")}
						>
							<Icon which={close} />
						</button>
					</SlideTransition>
				</Dialog>
			</Transition.Root>
		</>
	)
}

const SlideLeftTransition = createTransitionComponent({
	enterFrom: "-translate-x-full",
	enterTo: "translate-x-0",
})

const SlideRightTransition = createTransitionComponent({
	enterFrom: "translate-x-full",
	enterTo: "translate-x-0",
})
