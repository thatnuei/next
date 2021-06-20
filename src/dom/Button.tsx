import type { ComponentProps } from "react"
import { autoRef } from "../react/autoRef"

/** Regular DOM button with a better default type */
export default autoRef(function Button(props: ComponentProps<"button">) {
	return <button type="button" {...props} />
})
