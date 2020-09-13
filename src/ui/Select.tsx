import { ComponentPropsWithoutRef } from "react"

export default function Select({
	onChange,
	onChangeValue,
	...props
}: ComponentPropsWithoutRef<"select"> & {
	onChangeValue?: (value: string) => void
}) {
	return (
		<select
			onChange={event => {
				onChange?.(event)
				onChangeValue?.(event.target.value)
			}}
			{...props}
		/>
	)
}
