import "react"
import "react-dom"

declare module "react" {
	export function createContext<T>(): Context<T | undefined>

	export function startTransition(callback: () => void): void
}

declare module "react-dom" {
	export interface ReactRoot {
		render(element: React.ReactElement): void
	}

	export function createRoot(element: HTMLElement | null): ReactRoot
}
