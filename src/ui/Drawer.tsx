import clsx from "clsx"
import { fadedButton, raisedPanel } from "./components"
import { createTransitionComponent } from "./createTransitionComponent"
import type { DialogBaseProps } from "./DialogBase"
import DialogBase from "./DialogBase"
import Icon from "./Icon"
import { close } from "./icons"

type Props = {
  children: React.ReactNode
  side: "left" | "right" | "top" | "bottom"
} & Omit<DialogBaseProps, "children">

export default function Drawer(props: Props) {
  const TransitionComponent = {
    left: SlideLeftTransition,
    right: SlideRightTransition,
    top: SlideTopTransition,
    bottom: SlideBottomTransition,
  }[props.side]

  return (
    <DialogBase {...props}>
      {(content) => (
        <TransitionComponent
          child
          className={clsx(
            "pointer-events-none",
            props.side === "right" && "flex fixed inset-0 flex-row-reverse",
            props.side === "left" && "flex fixed inset-0",
            props.side === "top" && "flex flex-col fixed inset-0",
            props.side === "bottom" && "flex flex-col-reverse fixed inset-0",
          )}
        >
          <div
            className={clsx(raisedPanel, "overflow-y-auto pointer-events-auto")}
          >
            {props.children}
          </div>
          <button
            type="button"
            onClick={() => content.setOpen(false)}
            title="Close"
            className={clsx(fadedButton, "p-2 pointer-events-auto self-start")}
          >
            <Icon which={close} />
          </button>
        </TransitionComponent>
      )}
    </DialogBase>
  )
}

const SlideLeftTransition = createTransitionComponent({
  enterFrom: "-translate-x-full",
  enterTo: "translate-x-0",
})

const SlideRightTransition = createTransitionComponent({
  enterFrom: "translate-x-full",
  enterTo: "translate-x-0",
})

const SlideTopTransition = createTransitionComponent({
  enterFrom: "-translate-y-full",
  enterTo: "translate-y-0",
})

const SlideBottomTransition = createTransitionComponent({
  enterFrom: "translate-y-full",
  enterTo: "translate-y-0",
})
