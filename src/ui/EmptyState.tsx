export default function EmptyState({
	children = "Nothing here!",
}: {
	children?: React.ReactNode
}) {
	return (
		<p className="p-8 text-xl italic text-center opacity-50 font-condensed">
			{children}
		</p>
	)
}
