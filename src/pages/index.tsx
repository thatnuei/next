import Router from "next/router"
import { useEffect } from "react"
import { QueryStatus } from "react-query"
import { useCharacterListQuery } from "../modules/auth/character-list"

export default function Index() {
	const characterListQuery = useCharacterListQuery()

	useEffect(() => {
		if (characterListQuery.status === QueryStatus.Success) {
			Router.replace("/character-select")
		}
		if (characterListQuery.status === QueryStatus.Error) {
			Router.replace("/login")
		}
	}, [characterListQuery.status])

	return <p>Loading...</p>
}
