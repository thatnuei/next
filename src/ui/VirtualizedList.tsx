import * as React from "react"
import { ComponentType, Key, useState } from "react"
import { FixedSizeList, ListChildComponentProps } from "react-window"
import { tw } from "twind"
import { useElementSize } from "../dom/useElementSize"
import { TagProps } from "../jsx/types"

type Props<T> = TagProps<"div"> & {
	items: T[]
	itemSize: number
	renderItem: (info: RenderItemInfo<T>) => void
	getItemKey: (item: T) => Key
}

export type RenderItemInfo<T> = {
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
		<div className={tw`w-full h-full`} ref={setContainer} {...props}>
			<FixedSizeList
				width={dimensions.width}
				height={dimensions.height}
				itemCount={items.length}
				itemSize={itemSize}
				itemData={{ items, renderItem }}
				itemKey={(index) => getItemKey(items[index])}
				overscanCount={10}
				children={ListItem as ComponentType<ListChildComponentProps>}
			/>
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
