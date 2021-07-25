import * as React from "react"
import ExternalLink from "../dom/ExternalLink"
import { getProfileUrl } from "../flist/helpers"
import ContextMenu, {
	ContextMenuButton,
	ContextMenuPanel,
} from "../ui/ContextMenu"
import CharacterMenu from "./CharacterMenu"

interface Props {
	name: string
	children: React.ReactNode
}

export default function CharacterMenuTarget({ name, children }: Props) {
	return (
		<ContextMenu>
			<ContextMenuButton>
				<ExternalLink href={getProfileUrl(name)}>{children}</ExternalLink>
			</ContextMenuButton>
			<ContextMenuPanel>
				<CharacterMenu name={name} />
			</ContextMenuPanel>
		</ContextMenu>
	)
}
