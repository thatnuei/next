import { useEffect, useState } from "react"

export default function App() {
	const [count, setCount] = useState(0)

	useEffect(() => {
		const id = setInterval(() => setCount((c) => c + 1), 1000)
		return () => clearInterval(id)
	}, [])

	return <p>hello {count}</p>
}
