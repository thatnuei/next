import { Dialog } from "@headlessui/react"
import clsx from "clsx"
import {
  fadedButton,
  headerText,
  raisedPanel,
  raisedPanelHeader,
} from "./components"
import type { DialogBaseProps } from "./DialogBase"
import DialogBase from "./DialogBase"
import FadeRiseTransition from "./FadeRiseTransition"
import Icon from "./Icon"
import { close } from "./icons"

type Props = {
  title: string
  renderContent?: (props: ChildrenProps) => React.ReactNode
  children?: React.ReactNode
} & Omit<DialogBaseProps, "children">

type ChildrenProps = {
  close: () => void
}

export default function Modal(props: Props) {
  return (
    <DialogBase {...props}>
      {(content) => (
        <FadeRiseTransition
          child
          className="fixed inset-0 flex flex-col p-4 pointer-events-none"
        >
          <div
            className={clsx(
              raisedPanel,
              "w-full max-w-xl h-[fit-content] max-h-full m-auto flex flex-col pointer-events-auto",
            )}
          >
            <div className={clsx(raisedPanelHeader, "relative")}>
              <Dialog.Title as="h2" className={headerText}>
                {props.title}
              </Dialog.Title>
              <button
                type="button"
                onClick={() => content.setOpen(false)}
                title="Close"
                className={clsx(fadedButton, `absolute right-2 self-center`)}
              >
                <Icon which={close} />
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">
              {props.renderContent?.({ close: () => content.setOpen(false) })}
              {props.children}
            </div>
          </div>
        </FadeRiseTransition>
      )}
    </DialogBase>
  )
}
