import { useEffect } from "react"
import { ChatStore } from "./ChatStore"
import { useInstanceValue } from "../react/useInstanceValue"

type Props = {
	account: string
	ticket: string
	identity: string
}

export default function Chat(props: Props) {
	const store = useInstanceValue(() => new ChatStore(props.identity))

	const { account, ticket, identity } = props
	useEffect(() => {
		store.socket.connect(account, ticket, identity)
		return () => store.socket.disconnect()
	}, [account, identity, store.socket, ticket])

	return null
}
