import { apply, tw } from "twind"
import { animation } from "twind/css"

type Props = { text: string }

function LoadingOverlay({ text }: Props) {
	const dotStyle = apply`w-5 h-5 rounded-full bg-clouds`

	return (
		<div
			className={tw`fixed inset-0 flex flex-col items-center justify-center text-center bg-black bg-opacity-50`}
		>
			<div
				className={tw`grid grid-cols-2 grid-rows-2 gap-4 p-6 ${spinAnimation}`}
			>
				<div className={tw`${dotStyle} bg-blue-500`}></div>
				<div className={tw`${dotStyle}`}></div>
				<div className={tw`${dotStyle}`}></div>
				<div className={tw`${dotStyle} bg-blue-500`}></div>
			</div>
			<p className={tw`text-2xl font-condensed`}>{text}</p>
		</div>
	)
}

export default LoadingOverlay

const spinAnimation = animation(`3.7s infinite`, {
	"0%": { transform: "rotate(0deg)" },
	"25%": { transform: "rotate(calc(270deg * 1))" },
	"50%": { transform: "rotate(calc(270deg * 2))" },
	"75%": { transform: "rotate(calc(270deg * 3))" },
	"100%": { transform: "rotate(calc(270deg * 4))" },
})
