import * as React from "react"
import { TagProps } from "../jsx/types"

/** Regular DOM button with a better default type */
function Button(props: TagProps<"button">, ref: React.Ref<HTMLButtonElement>) {
	return <button type="button" ref={ref} {...props} />
}

export default React.forwardRef(Button)
