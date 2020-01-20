import React, { PropsWithChildren } from "react"

type Props = PropsWithChildren<{}>

function FullscreenRaisedPanel(props: Props) {
  return (
    <div className="h-full">
      <div className="raised-panel">{props.children}</div>
    </div>
  )
}

export default FullscreenRaisedPanel
