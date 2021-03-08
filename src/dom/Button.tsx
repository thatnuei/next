import { ComponentProps } from "react"
import { autoRef } from "../react/autoRef"

/** Regular DOM button with a better default type */
function Button(props: ComponentProps<"button">) {
	return <button type="button" {...props} />
}

export default autoRef(Button)
