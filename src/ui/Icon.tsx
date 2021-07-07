export interface IconProps {
	which: string
}

export default function Icon({ which }: IconProps) {
	return (
		<svg className="w-6 h-6" viewBox="0 0 24 24">
			<path d={which} className="fill-current" />
		</svg>
	)
}
