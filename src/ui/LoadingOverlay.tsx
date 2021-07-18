import type { ReactNode } from "react"
import LoadingIcon from "./LoadingIcon"

export default function LoadingOverlay({ children }: { children: ReactNode }) {
	return (
		<div
			className={`fixed inset-0 flex flex-col items-center justify-center text-center bg-black bg-opacity-50`}
		>
			<LoadingIcon />
			<div className="flex flex-col items-center gap-4">{children}</div>
		</div>
	)
}

export function LoadingOverlayText({ children }: { children: ReactNode }) {
	return <p className={`text-2xl font-condensed`}>{children}</p>
}
