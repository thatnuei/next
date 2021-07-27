import clsx from "clsx"
import type { FallbackProps } from "react-error-boundary"
import { ErrorBoundary } from "react-error-boundary"
import { toError } from "./common/toError"
import { raisedPanel, solidButton } from "./ui/components"

export default function AppErrorBoundary({
	children,
}: {
	children: React.ReactNode
}) {
	return <ErrorBoundary FallbackComponent={Fallback}>{children}</ErrorBoundary>
}

function Fallback({ error, resetErrorBoundary }: FallbackProps) {
	const { stack, message } = toError(error)
	return (
		<main className="p-8">
			<div className={clsx(raisedPanel, "p-4 space-y-4")}>
				<h1 className="font-condensed text-3xl">
					oops, something went wrong :(
				</h1>
				<pre className="bg-black/50 p-4 overflow-x-auto">
					{stack || message}
				</pre>
				<button className={solidButton} onClick={resetErrorBoundary}>
					Try again
				</button>
			</div>
		</main>
	)
}
