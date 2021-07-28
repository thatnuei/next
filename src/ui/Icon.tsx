import clsx from "clsx"

export interface IconProps {
	which: string
	size?: keyof typeof sizeClasses
	inline?: boolean
}

const sizeClasses = {
	4: `w-4 h-4`,
	5: `w-5 h-5`,
	6: `w-6 h-6`,
	8: `w-8 h-8`,
	10: `w-10 h-10`,
	12: `w-12 h-12`,
	16: `w-16 h-16`,
}

export default function Icon({ which, size = 6, inline }: IconProps) {
	return (
		<svg
			className={clsx(sizeClasses[size], inline && "inline align-text-top")}
			viewBox="0 0 24 24"
		>
			<path d={which} className="fill-current" />
		</svg>
	)
}
