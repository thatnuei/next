import * as RadixMenu from "@radix-ui/react-dropdown-menu"
import { Slot } from "@radix-ui/react-slot"
import { ReactElement, ReactNode } from "react"
import { css } from "twind/css"
import { radixTransition } from "./helpers"

export default function DropdownMenu({ children }: { children: ReactNode }) {
	return <RadixMenu.Root>{children}</RadixMenu.Root>
}

export function DropdownMenuButton({ children }: { children: ReactElement }) {
	return <RadixMenu.Trigger as={Slot as any}>{children}</RadixMenu.Trigger>
}

export function DropdownMenuPanel({ children }: { children: ReactNode }) {
	return (
		<RadixMenu.Content
			tw={[
				`w-56 shadow bg-midnight-1`,
				css({
					transformOrigin:
						"var(--radix-dropdown-menu-content-transform-origin)",
				}),
				radixTransition({
					start: css({ opacity: 0, transform: `scale(0.9)` }),
					end: css({ opacity: 1, transform: `scale(1.0)` }),
				}),
			]}
		>
			{children}
		</RadixMenu.Content>
	)
}

export function DropdownMenuItem({
	children,
	icon,
}: {
	children: ReactElement
	icon?: ReactNode
}) {
	return (
		<div tw="relative flex transition-opacity opacity-50 hover:opacity-100 focus-within:opacity-100">
			<RadixMenu.Item
				as={Slot as any}
				tw={`p-2 flex-1 flex flex-row ${icon != null && `pl-10`}`}
			>
				{children}
			</RadixMenu.Item>
			{icon != null && <div tw="absolute self-center left-2">{icon}</div>}
		</div>
	)
}

export function DropdownMenuCheckbox({
	children,
	icon,
	checked,
	onCheckedChange,
}: {
	children: ReactElement
	icon?: ReactNode
	checked: boolean
	onCheckedChange: (checked?: boolean) => void
}) {
	return (
		<div tw="relative flex transition-opacity opacity-50 hover:opacity-100 focus-within:opacity-100">
			<RadixMenu.CheckboxItem
				as={Slot as any}
				tw={`p-2 flex-1 flex flex-row ${icon != null && `pl-10`}`}
				checked={checked}
				onCheckedChange={onCheckedChange}
			>
				{children}
			</RadixMenu.CheckboxItem>
			{icon != null && <div tw="absolute self-center left-2">{icon}</div>}
		</div>
	)
}
