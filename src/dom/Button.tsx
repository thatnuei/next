import { ComponentProps } from "react"
import { autoRef } from "../react/autoRef"

/** Regular DOM button with a better default type */
function Button({ className, tw, ...props }: ComponentProps<"button">) {
	return <button type="button" tw={tw} className={className} {...props} />
}

export default autoRef(Button)
