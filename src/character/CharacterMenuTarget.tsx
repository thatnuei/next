import { Portal, Transition } from "@headlessui/react"
import type { ReactNode } from "react"
import { useState } from "react"
import { FocusOn } from "react-focus-on"
import ExternalLink from "../dom/ExternalLink"
import { getProfileUrl } from "../flist/helpers"
import { raisedPanel } from "../ui/components"
import FadeRiseTransition from "../ui/FadeRiseTransition"
import usePopper from "../ui/usePopper"
import CharacterMenu from "./CharacterMenu"

interface Props {
	name: string
	children: ReactNode
}

export default function CharacterMenuTarget({ name, children }: Props) {
	const { popperRef, referenceRef } = usePopper()
	const [open, setOpen] = useState(false)
	return (
		<>
			<ExternalLink
				href={getProfileUrl(name)}
				ref={referenceRef}
				onContextMenu={(event) => {
					event.preventDefault()
					setOpen(true)
				}}
			>
				{children}
			</ExternalLink>

			<Transition.Root className="contents" show={open}>
				<Portal>
					<FocusOn onClickOutside={() => setOpen(false)}>
						<div ref={popperRef}>
							<FadeRiseTransition child className={raisedPanel}>
								<div className={"w-60 bg-midnight-1"}>
									<CharacterMenu name={name} />
								</div>
							</FadeRiseTransition>
						</div>
					</FocusOn>
				</Portal>
			</Transition.Root>
		</>
	)
}
