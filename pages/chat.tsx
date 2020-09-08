import { useRouter } from "next/router"

export default function Chat() {
	const router = useRouter()
	const identity = String(router.query.identity)
	return identity
}
