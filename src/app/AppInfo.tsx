import clsx from "clsx"
import ExternalLink from "../dom/ExternalLink"
import { headerText2 } from "../ui/components"

export default function AppInfo() {
	return (
		<div className="prose">
			<h2 className={clsx(headerText2, "opacity-75")}>next v{APP_VERSION}</h2>
			<p>
				next is an{" "}
				<ExternalLink href="https://github.com/thatnuei/next">
					open source
				</ExternalLink>{" "}
				custom F-Chat client. Your F-List account and password is only used to
				interact with the F-List servers, and is not stored or saved anywhere
				else.
			</p>
			<p>
				If you&apos;re still not comfortable putting your credentials here, then
				don&apos;t use this app c:
			</p>
			<p>
				Still in alpha phase; a lot of features are missing! If you have any
				ideas or feature requests, send a note to{" "}
				<ExternalLink href="https://www.f-list.net/c/next-dev/">
					next-dev
				</ExternalLink>{" "}
				on F-List.
			</p>
		</div>
	)
}
