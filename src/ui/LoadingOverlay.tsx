import { motion } from "framer-motion"
import { tw } from "twind"
import { animation } from "twind/css"
import { fadeAnimation } from "./animation"
import { headerText2 } from "./components"
import { centerItems, fixedCover, flexColumn } from "./helpers"

type Props = { text: string }

function LoadingOverlay(props: Props) {
	const dotStyle = tw`w-4 h-4 bg-white rounded-full`

	return (
		<motion.div
			className={tw([fixedCover, flexColumn, centerItems, tw`bg-black-faded`])}
			{...fadeAnimation}
		>
			<div
				className={tw([
					tw`grid grid-cols-2 grid-rows-2 gap-4 p-4`,
					spinAnimation,
				])}
			>
				<div className={tw([dotStyle, tw`bg-blue`])}></div>
				<div className={dotStyle}></div>
				<div className={dotStyle}></div>
				<div className={tw([dotStyle, tw`bg-blue`])}></div>
			</div>
			<p className={headerText2}>{props.text}</p>
		</motion.div>
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
