import clsx from "clsx"
import type { FallbackProps } from "react-error-boundary"
import { ErrorBoundary } from "react-error-boundary"
import { toError } from "../common/toError"
import { raisedPanel, solidButton } from "../ui/components"

export default function AppErrorBoundary({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
			{children}
		</ErrorBoundary>
	)
}

function ErrorBoundaryFallback({ error, resetErrorBoundary }: FallbackProps) {
	const { stack, message } = toError(error)
	return (
		<main className="p-8">
			<div className={clsx(raisedPanel, "p-4 space-y-4")}>
				<h1 className="text-3xl font-condensed">
					oops, something went wrong :(
				</h1>
				<pre className="p-4 overflow-x-auto bg-black/50">
					{stack || message}
				</pre>
				<button className={solidButton} onClick={resetErrorBoundary}>
					Try again
				</button>
			</div>
		</main>
	)
}
