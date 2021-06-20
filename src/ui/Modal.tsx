import { Dialog } from "@headlessui/react"
import clsx from "clsx"
import {
	fadedButton,
	headerText,
	raisedPanel,
	raisedPanelHeader,
} from "./components"
import DialogBase, { DialogBaseProps } from "./DialogBase"
import FadeRiseTransition from "./FadeRiseTransition"
import Icon from "./Icon"
import { close } from "./icons"

type Props = Omit<DialogBaseProps, "renderContent"> & {
	title: string
	children: React.ReactNode
}

export default function Modal(props: Props) {
	return (
		<DialogBase {...props}>
			{(content) => (
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
								onClick={() => content.setOpen(false)}
								title="Close"
								className={clsx(fadedButton, `absolute right-2 self-center`)}
							>
								<Icon which={close} />
							</button>
						</div>
						{props.children}
					</FadeRiseTransition>
				</div>
			)}
		</DialogBase>
	)
}
