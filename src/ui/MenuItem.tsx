import { tw } from "twind"
import ExternalLink from "../dom/ExternalLink"
import Icon from "./Icon"

type Props = {
	icon: string
	text: string
} & ({ href: string } | { onClick: () => void })

const itemStyle = tw`flex flex-row p-2 transition opacity-50 hover:opacity-100`

export default function MenuItem(props: Props) {
	const content = (
		<>
			<Icon which={props.icon} />
			<span className={tw`ml-2`}>{props.text}</span>
		</>
	)

	return "onClick" in props ? (
		<button className={itemStyle} onClick={props.onClick}>
			{content}
		</button>
	) : (
		<ExternalLink className={itemStyle} href={props.href}>
			{content}
		</ExternalLink>
	)
}
