import { debounce } from "lodash-es"
import { useEffect, useMemo, useState } from "react"
import tw from "twin.macro"
import { TagProps } from "../jsx/types"
import { useRootStore } from "../root/context"
import { input } from "../ui/components"

type Props = {
	name: string
} & TagProps<"textarea">

export default function CharacterMemoInput({ name, ...props }: Props) {
	const root = useRootStore()

	type State =
		| { status: "loading" }
		| { status: "editing"; memo: string }
		| { status: "error" }

	const [state, setState] = useState<State>({ status: "loading" })

	useEffect(() => {
		setState({ status: "loading" })

		let cancelled = false

		root.userStore
			.getMemo({ name })
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
	}, [name, root.userStore])

	const saveMemoDebounced = useMemo(() => {
		const setMemo = (memo: string) => {
			root.userStore.setMemo({ name, note: memo }).catch(console.warn)
		}
		return debounce(setMemo, 800)
	}, [name, root.userStore])

	function handleChange(memo: string) {
		if (state.status === "editing") {
			setState({ ...state, memo })
		}
		void saveMemoDebounced(memo)
	}

	const style = [input, tw`h-20 text-sm`]

	if (state.status === "loading") {
		return (
			<textarea
				css={style}
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
				css={style}
				value={state.memo}
				onChange={(event) => handleChange(event.target.value)}
				placeholder="Enter a memo"
				{...props}
			/>
		)
	}

	if (state.status === "error") {
		return <p css={tw`text-sm`}>Failed to load memo</p>
	}

	return null
}
