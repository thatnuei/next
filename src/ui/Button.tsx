import { ComponentPropsWithoutRef } from "react"

// TODO: add loading prop to show a loading spinner
export default function Button(props: ComponentPropsWithoutRef<"button">) {
	return <button type="button" {...props} />
}
