import clsx from "clsx"
import { fadedButton, raisedPanel } from "./components"
import { createTransitionComponent } from "./createTransitionComponent"
import DialogBase, { DialogBaseProps } from "./DialogBase"
import Icon from "./Icon"
import { close } from "./icons"

type Props = Omit<DialogBaseProps, "children"> & {
	children: React.ReactNode
	side: "left" | "right"
}

export default function Drawer(props: Props) {
	const SlideTransition =
		props.side === "left" ? SlideLeftTransition : SlideRightTransition

	return (
		<DialogBase {...props}>
			{(content) => (
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
						onClick={() => content.setOpen(false)}
						title="Close"
						className={clsx(fadedButton, "p-2 pointer-events-auto")}
					>
						<Icon which={close} />
					</button>
				</SlideTransition>
			)}
		</DialogBase>
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
