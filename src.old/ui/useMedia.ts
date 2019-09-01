import { useEffect, useState } from "react"

export default function useMedia(query: string) {
  const [matches, setMatches] = useState(window.matchMedia(query).matches)

  useEffect(() => {
    const queryList = window.matchMedia(query)

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    queryList.addEventListener("change", handleChange)
    return () => queryList.removeEventListener("change", handleChange)
  }, [query])

  return matches
}
