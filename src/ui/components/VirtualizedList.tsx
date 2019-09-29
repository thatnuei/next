import { useRect } from "@reach/rect"
import React, { useRef } from "react"
import { FixedSizeList } from "react-window"
import { fillArea } from "../helpers"
import { styled } from "../styled"

type Props<T> = {
  items: T[]
  itemHeight: number
  renderItem: (item: T) => React.ReactNode
  getItemKey: (item: T) => string | number
}

function VirtualizedList<T>(props: Props<T>) {
  const listContainerRef = useRef<HTMLDivElement>(null)
  const listRect = useRect(listContainerRef)

  return (
    <ListContainer ref={listContainerRef}>
      <FixedSizeList
        width={listRect ? listRect.width : 0}
        height={listRect ? listRect.height : 0}
        itemSize={props.itemHeight}
        itemCount={props.items.length}
        itemKey={(index) => props.getItemKey(props.items[index])}
        children={({ index, style }) => (
          <div style={style}>{props.renderItem(props.items[index])}</div>
        )}
      />
    </ListContainer>
  )
}

export default VirtualizedList

const ListContainer = styled.div`
  ${fillArea};
`
