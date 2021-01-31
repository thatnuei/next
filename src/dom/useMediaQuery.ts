import { useEffect, useState } from "react"

export function useMediaQuery(query: string) {
	const [matches, setMatches] = useState(window.matchMedia(query).matches)

	useEffect(() => {
		const queryList = window.matchMedia(query)

		const listener = (event: MediaQueryListEvent) => {
			setMatches(event.matches)
		}

		queryList.addEventListener("change", listener)
		return () => queryList.removeEventListener("change", listener)
	}, [query])

	return matches
}
