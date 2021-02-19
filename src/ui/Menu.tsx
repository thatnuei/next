import constate from "constate"
import {
	cloneElement,
	MouseEvent,
	ReactElement,
	ReactNode,
	useMemo,
	useState,
} from "react"
import * as reakit from "reakit"
import { apply, tw } from "twind"
import { css } from "twind/css"
import { useElementSize } from "../dom/useElementSize"
import { useWindowSize } from "../dom/useWindowSize"

const [MenuProvider, useMenuContext] = constate(() => {
	const dialog = reakit.useDialogState({
		animated: true,
		modal: true,
	})

	const buttonId = useMemo(() => `menu-button-${Math.random()}`, [])

	// reakit's menu would normally work fine here,
	// but it follows the element, and that's problematic when stuff moves around,
	// can lead to misclicks
	//
	// so we have this garbage to make it so it stays where it was
	// when the button was initially clicked
	// ...kinda like how context menus normally work
	const [position, setPosition] = useState({ left: 0, top: 0 })
	const [dialogElement, dialogElementRef] = useState<HTMLElement | null>()
	const windowSize = useWindowSize()
	const dialogSize = useElementSize(dialogElement)

	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		const button = event.currentTarget.getBoundingClientRect()
		setPosition({ left: button.left, top: button.bottom })
	}

	const boundedPosition = {
		left: Math.min(position.left, windowSize.width - dialogSize.width - 8),
		top: Math.min(position.top, windowSize.height - dialogSize.height - 8),
	}

	return {
		dialog,
		buttonId,
		position: boundedPosition,
		handleClick,
		dialogElementRef,
	}
})

export default function Menu({ children }: { children: ReactNode }) {
	return <MenuProvider>{children}</MenuProvider>
}

export function MenuButton({ children }: { children: ReactElement }) {
	const { dialog, buttonId, handleClick } = useMenuContext()
	return (
		<reakit.DialogDisclosure {...dialog} onClick={handleClick}>
			{(button) => cloneElement(children, { ...button, id: buttonId })}
		</reakit.DialogDisclosure>
	)
}

export function MenuPanel({ children }: { children: ReactNode }) {
	const { dialog, buttonId, dialogElementRef, position } = useMenuContext()
	return (
		<reakit.Dialog
			{...dialog}
			aria-labelledby={buttonId}
			className={tw`
				transition-opacity opacity-0
				${css({ "&[data-enter]": apply`opacity-100` })}	
			`}
		>
			<div
				className={tw`
					absolute
					w-56 shadow bg-midnight-1
					transition-transform scale-95 origin-top
					${css({ "[data-enter] &": apply`scale-100` })}	
				`}
				ref={dialogElementRef}
				style={position}
			>
				{dialog.visible || dialog.animating ? children : null}
			</div>
		</reakit.Dialog>
	)
}

export function MenuItem({
	children,
	icon,
	stayOpenOnClick,
}: {
	children: ReactElement
	icon?: ReactNode
	stayOpenOnClick?: boolean
}) {
	const { dialog } = useMenuContext()
	return (
		<div
			className={tw`relative flex transition-opacity opacity-50 hover:opacity-100 focus-within:opacity-100`}
		>
			<reakit.Button
				className={tw`p-2 flex-1 flex flex-row ${icon != null && `pl-10`}`}
				onClick={() => {
					if (!stayOpenOnClick) dialog.hide()
					children.props.onClick?.()
				}}
			>
				{(menuItem) => cloneElement(children, menuItem)}
			</reakit.Button>
			{icon != null && (
				<div className={tw`absolute self-center left-2`}>{icon}</div>
			)}
		</div>
	)
}
