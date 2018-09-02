import { observer } from "mobx-react"
import React from "react"
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List,
  ListRowRenderer,
  Size,
} from "react-virtualized"
import { Message } from "../message/Message"
import { MessageModel } from "../message/MessageModel"

export interface ConversationMessageListProps {
  messages: MessageModel[]
}

@observer
export class ConversationMessageList extends React.Component<ConversationMessageListProps> {
  cellMeasurerCache = new CellMeasurerCache({
    defaultHeight: 100,
    fixedWidth: true,
  })

  render() {
    return <AutoSizer>{this.renderList}</AutoSizer>
  }

  private renderList = (size: Size) => {
    return (
      <List
        {...size}
        deferredMeasurementCache={this.cellMeasurerCache}
        rowHeight={this.cellMeasurerCache.rowHeight}
        rowCount={this.props.messages.length}
        rowRenderer={this.renderRow}
      />
    )
  }

  private renderRow: ListRowRenderer = (row) => {
    const model = this.props.messages[row.index]

    return (
      <CellMeasurer
        key={row.key}
        cache={this.cellMeasurerCache}
        parent={row.parent}
        rowIndex={row.index}
      >
        <div style={row.style}>
          <Message key={model.id} model={model} />
        </div>
      </CellMeasurer>
    )
  }
}
