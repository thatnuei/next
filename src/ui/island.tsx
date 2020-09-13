import clsx from "clsx"
import { ComponentPropsWithoutRef } from "react"

export function IslandContainer({
	className,
	...props
}: ComponentPropsWithoutRef<"div">) {
	return (
		<div
			className={clsx(
				"flex flex-col items-center justify-center min-h-screen p-8",
				className,
			)}
			{...props}
		/>
	)
}

export function IslandPanel({
	className,
	...props
}: ComponentPropsWithoutRef<"div">) {
	return <div className={clsx("shadow bg-midnight-0", className)} {...props} />
}

export function IslandPanelHeader({
	className,
	...props
}: ComponentPropsWithoutRef<"div">) {
	return (
		<div
			className={clsx(
				"p-4 text-3xl leading-none text-center bg-midnight-1 font-header",
				className,
			)}
			{...props}
		/>
	)
}
