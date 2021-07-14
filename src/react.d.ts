import "react"
import "react-dom"

declare module "react" {
	export function createContext<T>(): Context<T | undefined>

	export function startTransition(callback: () => void): void

	/**
	 * @see https://reactjs.org/docs/concurrent-mode-patterns.html#deferring-a-value
	 */
	export function useDeferredValue<T>(value: T): T
}

declare module "react-dom" {
	export interface ReactRoot {
		render(element: React.ReactElement): void
	}

	export function createRoot(element: HTMLElement | null): ReactRoot
}
