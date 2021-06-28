import * as React from "react"
import type { ComponentType, Key } from "react"
import { useState } from "react"
import type { ListChildComponentProps } from "react-window"
import { FixedSizeList } from "react-window"
import { useElementSize } from "../dom/useElementSize"
import type { TagProps } from "../jsx/types"

type Props<T> = TagProps<"div"> & {
	items: T[]
	itemSize: number
	renderItem: (info: RenderItemInfo<T>) => void
	getItemKey: (item: T) => Key
}

export interface RenderItemInfo<T> {
	item: T
	style: React.CSSProperties
}

function VirtualizedList<T>({
	items,
	itemSize,
	renderItem,
	getItemKey,
	...props
}: Props<T>) {
	const [container, setContainer] = useState<Element | null>()
	const dimensions = useElementSize(container)

	return (
		<div className={`w-full h-full`} ref={setContainer} {...props}>
			<FixedSizeList
				width={dimensions.width}
				height={dimensions.height}
				itemCount={items.length}
				itemSize={itemSize}
				itemData={{ items, renderItem }}
				itemKey={(index) => getItemKey(items[index])}
				overscanCount={10}
			>
				{ListItem as ComponentType<ListChildComponentProps>}
			</FixedSizeList>
		</div>
	)
}

export default VirtualizedList

function ListItem<T>({
	index,
	style,
	data,
}: {
	index: number
	style: React.CSSProperties
	data: { items: T[]; renderItem: (info: RenderItemInfo<T>) => void }
}) {
	return data.renderItem({ item: data.items[index], style })
}
