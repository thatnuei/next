import Link from "next/link"
import Router from "next/router"
import { useState } from "react"
import { ErrorBoundary, FallbackProps } from "react-error-boundary"
import { compare } from "../modules/helpers/compare"
import { raise } from "../modules/helpers/raise"
import {
	characterListResource,
	identityResource,
	sessionResource,
} from "../modules/user"

const loginRequired = Symbol()

export default function Page() {
	return (
		<ErrorBoundary FallbackComponent={ErrorFallback}>
			<CharacterSelect />
		</ErrorBoundary>
	)
}

function CharacterSelect() {
	const session = sessionResource.read() ?? raise(loginRequired)
	const { characters } = characterListResource.read(session)

	const [character, setCharacter] = useState(characters[0])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		identityResource.setData(character, session.account)
		Router.push(`/chat`)
	}

	return (
		<form onSubmit={handleSubmit}>
			<select value={character} onChange={(e) => setCharacter(e.target.value)}>
				{characters
					.slice()
					.sort(compare((name) => name.toLowerCase()))
					.map((name) => (
						<option key={name} value={name}>
							{name}
						</option>
					))}
			</select>
			<button type="submit">Enter chat</button>
			<Link href="/login">
				<a>Return to login</a>
			</Link>
		</form>
	)
}

function ErrorFallback({ error }: FallbackProps) {
	if ((error as unknown) === loginRequired) {
		return (
			<>
				<p>Login required</p>
				<Link href="/login">
					<a>Return to login</a>
				</Link>
			</>
		)
	}

	throw error
}
