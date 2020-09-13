import { ComponentPropsWithoutRef } from "react"

export function ErrorText({
	className,
	...props
}: ComponentPropsWithoutRef<"div">) {
	return <div role="alert" className="text-red" {...props} />
}
