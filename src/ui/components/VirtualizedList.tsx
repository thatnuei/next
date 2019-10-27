import { useRect } from "@reach/rect"
import React, { useRef } from "react"
import { FixedSizeList, ListChildComponentProps } from "react-window"
import { fillArea } from "../helpers"
import { styled } from "../styled"

type Props<T> = {
  items: T[]
  itemHeight: number
  renderItem: (item: T) => React.ReactNode
  getItemKey: (item: T) => string | number
}

function VirtualizedList<T>({
  items,
  itemHeight,
  renderItem,
  getItemKey,
}: Props<T>) {
  const listContainerRef = useRef<HTMLDivElement>(null)
  const { width = 0, height = 0 } = useRect(listContainerRef) || {}

  return (
    <ListContainer ref={listContainerRef}>
      <FixedSizeList
        width={width}
        height={height}
        itemSize={itemHeight}
        itemCount={items.length}
        itemKey={(index) => getItemKey(items[index])}
        overscanCount={10}
        itemData={{ items, renderItem }}
        children={Row}
      />
    </ListContainer>
  )
}

export default VirtualizedList

function Row(props: ListChildComponentProps) {
  return (
    <div style={props.style}>
      {props.data.renderItem(props.data.items[props.index])}
    </div>
  )
}

const ListContainer = styled.div`
  ${fillArea};
`
