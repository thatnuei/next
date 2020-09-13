import { ComponentPropsWithoutRef } from "react"

export default function Button(props: ComponentPropsWithoutRef<"button">) {
	return <button type="button" {...props} />
}
