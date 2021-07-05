import clsx from "clsx"
import type { ComponentProps } from "react"
import { autoRef } from "../react/autoRef"

/** Regular DOM button with a better default type */
export default autoRef(function Button({
	disabled,
	className,
	...props
}: ComponentProps<"button">) {
	return (
		<button
			type="button"
			className={clsx(disabled && `opacity-50 pointer-events-none`, className)}
			aria-disabled={disabled ?? false}
			{...props}
		/>
	)
})
