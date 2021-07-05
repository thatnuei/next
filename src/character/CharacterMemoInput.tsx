import { debounce } from "lodash-es"
import { useEffect, useMemo, useState } from "react"
import { useAuthUserContext } from "../chat/authUserContext"
import type { TagProps } from "../jsx/types"
import { input } from "../ui/components"

type Props = {
	name: string
} & TagProps<"textarea">

export default function CharacterMemoInput({ name, ...props }: Props) {
	const { getMemo, setMemo } = useAuthUserContext()

	type State =
		| { status: "loading" }
		| { status: "editing"; memo: string }
		| { status: "error" }

	const [state, setState] = useState<State>({ status: "loading" })

	useEffect(() => {
		setState({ status: "loading" })

		let cancelled = false

		getMemo({ name })
			.then((memo): State => ({ status: "editing", memo }))
			.catch((): State => ({ status: "error" }))
			.then((state) => {
				if (cancelled) return
				setState(state)
			})
			.catch(console.warn)

		return () => {
			cancelled = true
		}
	}, [getMemo, name])

	const saveMemoDebounced = useMemo(() => {
		const saveMemo = (memo: string) => {
			setMemo({ name, note: memo }).catch(console.warn)
		}
		return debounce(saveMemo, 800)
	}, [name, setMemo])

	function handleChange(memo: string) {
		if (state.status === "editing") {
			setState({ ...state, memo })
		}
		void saveMemoDebounced(memo)
	}

	const inputClass = `${input} h-20 text-sm`

	if (state.status === "loading") {
		return (
			<textarea
				className={inputClass}
				disabled
				placeholder="Loading..."
				value=""
				{...props}
			/>
		)
	}

	if (state.status === "editing") {
		return (
			<textarea
				className={inputClass}
				value={state.memo}
				onChange={(event) => handleChange(event.target.value)}
				placeholder="Enter a memo"
				{...props}
			/>
		)
	}

	if (state.status === "error") {
		return <p className={`text-sm`}>Failed to load memo</p>
	}

	return null
}
