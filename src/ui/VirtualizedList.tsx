import React, { Key, useEffect, useState } from "react"
import { FixedSizeList, ListChildComponentProps } from "react-window"
import ResizeObserver from "resize-observer-polyfill"
import tw from "twin.macro"
import { TagProps } from "../jsx/types"

type Props<T> = TagProps<"div"> & {
  items: T[]
  itemSize: number
  renderItem: (info: RenderItemInfo<T>) => void
  getItemKey: (item: T) => Key
}

type RenderItemInfo<T> = {
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
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!container) return

    const observer = new ResizeObserver(([info]) =>
      setDimensions(info.contentRect),
    )
    observer.observe(container)

    return () => observer.disconnect()
  }, [container])

  return (
    <div css={tw`w-full h-full`} ref={setContainer} {...props}>
      <FixedSizeList
        width={dimensions.width}
        height={dimensions.height}
        itemCount={items.length}
        itemSize={itemSize}
        itemData={{ items, renderItem }}
        itemKey={(index) => getItemKey(items[index])}
        overscanCount={10}
        children={ListItem}
      />
    </div>
  )
}

export default VirtualizedList

function ListItem({ index, style, data }: ListChildComponentProps) {
  return data.renderItem({ item: data.items[index], style })
}
