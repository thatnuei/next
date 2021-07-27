export default function Timestamp({
	children,
	className,
}: {
	children: string | number
	className?: string
}) {
	const date = new Date(children)
	return (
		<time
			dateTime={date.toISOString()}
			title={date.toLocaleString(undefined, {
				dateStyle: "full",
				timeStyle: "medium",
			})}
			className={className}
		>
			{date
				.toLocaleString(undefined, { timeStyle: "medium" })
				.toLocaleLowerCase()}
		</time>
	)
}
