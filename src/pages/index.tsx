import Router from "next/router"
import { useEffect } from "react"

export default function Index() {
	// const characterListQuery = useCharacterListQuery()

	useEffect(() => {
		Router.replace("/login")
	}, [])

	return <p>Loading...</p>
}
