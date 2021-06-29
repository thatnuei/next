import clsx from "clsx"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { uniqueId } from "../common/uniqueId"
import { useEffectRef } from "../react/useEffectRef"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import { useToastContext } from "./ToastProvider"

export default function ToastCard(props: {
	type: "info" | "success" | "warning" | "error"
	duration: number
	children: string
	onFinish?: () => void
}) {
	const [element, setElement] = useState<HTMLElement | null>()
	const [portal, setPortal] = useState<HTMLElement>()
	const { register, unregister } = useToastContext()
	const [key] = useState(uniqueId)
	const onFinishRef = useEffectRef(props.onFinish)

	useEffect(() => {
		setPortal(register(key))
		return () => unregister(key)
	}, [key, register, unregister])

	useEffect(() => {
		if (!element) return

		// we want the effect to have the same lead in / lead out time, regardless of the duration
		// this number is the offset needed to achieve that
		const offsetDifference = (props.duration + 300) / props.duration - 1

		const animation = element.animate(
			[
				{ opacity: 0 },
				{ opacity: 1, offset: offsetDifference },
				{ opacity: 1, offset: 1 - offsetDifference },
				{ opacity: 0 },
			],
			{
				duration: props.duration,
				fill: "forwards",
			},
		)

		animation.onfinish = () => onFinishRef.current?.()
	}, [element, onFinishRef, props.duration])

	const typeInfo = {
		info: {
			className: clsx`bg-midnight-0`,
			icon: icons.about,
		},
		success: {
			className: clsx`bg-green-700`,
			icon: icons.check,
		},
		warning: {
			className: clsx`bg-yellow-600`,
			icon: icons.warning,
		},
		error: {
			className: clsx`bg-red-800`,
			icon: icons.close,
		},
	}[props.type]

	return portal
		? createPortal(
				<div
					className={clsx(
						`flex w-64 gap-1 px-3 py-2 text-white rounded shadow-lg transition-opacity`,
						typeInfo.className,
					)}
					ref={setElement}
				>
					<Icon which={typeInfo.icon} />
					<span className="self-center flex-1">{props.children}</span>
				</div>,
				portal,
		  )
		: null
}
