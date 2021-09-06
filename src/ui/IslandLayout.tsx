import clsx from "clsx"
import * as React from "react"
import type { ChildrenProps } from "../jsx/types"
import { headerText, raisedPanel, raisedPanelHeader } from "./components"
import FadeRiseTransition from "./FadeRiseTransition"

export default function IslandLayout(
  props: ChildrenProps & {
    title: React.ReactNode
    isVisible: boolean
    header?: React.ReactNode
    footer?: React.ReactNode
  },
) {
  return (
    <FadeRiseTransition
      className="fixed inset-0 flex flex-col p-4 overflow-y-auto"
      show={props.isVisible}
    >
      <div className="flex flex-col items-center gap-4 m-auto">
        {props.header && (
          <div className="max-w-sm px-4 mx-auto text-center">
            {props.header}
          </div>
        )}
        <div className={clsx(raisedPanel)}>
          <header className={raisedPanelHeader}>
            <h1 className={headerText}>{props.title}</h1>
          </header>
          {props.children}
        </div>
        {props.footer && (
          <div className="max-w-sm px-4 text-center">{props.footer}</div>
        )}
      </div>
    </FadeRiseTransition>
  )
}
