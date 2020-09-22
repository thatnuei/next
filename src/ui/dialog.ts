import { useCallback, useState } from "react"

export type DialogProps = {
	isVisible?: boolean
	onDismiss?: () => void
}

export function useDialog() {
	const [isVisible, setVisible] = useState(false)

	const props: DialogProps = {
		isVisible,
		onDismiss: () => setVisible(false),
	}

	return {
		isVisible,
		show: useCallback(() => setVisible(true), []),
		hide: useCallback(() => setVisible(false), []),
		props,
	}
}
