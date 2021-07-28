import type { PropsWithChildren } from "react"
import ExternalLink from "../dom/ExternalLink"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"

export default function BBCLink({
	url,
	children,
}: PropsWithChildren<{ url: string }>) {
	const domain = (() => {
		try {
			const { host } = new URL(url)
			return host
		} catch {
			return url
		}
	})()

	return (
		<ExternalLink href={url} className="group inline-block">
			<span className="opacity-75">
				<Icon which={icons.link} size={5} inline />
			</span>
			<span className={`underline group-hover:no-underline`}>{children}</span>{" "}
			<span style={{ fontSize: "85%" }}>[{domain}]</span>
		</ExternalLink>
	)
}
