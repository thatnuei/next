import { forwardRef, Ref } from "react"
import { TagProps } from "../jsx/types"

function ExternalLink(props: TagProps<"a">, ref: Ref<HTMLAnchorElement>) {
	// eslint-disable-next-line jsx-a11y/anchor-has-content
	return <a target="_blank" rel="noopener noreferrer" {...props} ref={ref} />
}

export default forwardRef(ExternalLink)
