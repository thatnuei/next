export default function ChatPage() {
	return null

	// switch (socketStatus) {
	// 	case "connecting":
	// 		return <p>Connecting...</p>

	// 	case "identifying":
	// 		return <p>Identifying...</p>

	// 	case "no-session":
	// 		return (
	// 			<>
	// 				<p>Login required</p>
	// 				<Link href="/login">
	// 					<a>Login</a>
	// 				</Link>
	// 			</>
	// 		)

	// 	case "closed":
	// 		return (
	// 			<>
	// 				<p>Connection closed</p>
	// 				<button type="button" onClick={() => socket.connect()}>
	// 					Reconnect
	// 				</button>
	// 				<Link href="/login">
	// 					<a>Login</a>
	// 				</Link>
	// 			</>
	// 		)

	// 	case "error":
	// 		return (
	// 			<>
	// 				<p>Could not connect: network error</p>
	// 				<button type="button" onClick={() => socket.connect()}>
	// 					Reconnect
	// 				</button>
	// 				<Link href="/login">
	// 					<a>Login</a>
	// 				</Link>
	// 			</>
	// 		)

	// 	case "online":
	// 		return <p>chat!</p>

	// 	default:
	// 		return null
	// }
}
