import React, { useEffect, useMemo, useState } from "react"
import { Transition, TransitionGroup } from "react-transition-group"
import { getAvatarUrl } from "../flist/helpers"
import {
  absolute,
  h,
  opacity,
  relative,
  scaleDown,
  transition,
  w,
} from "../ui/helpers.new"

type Props = {
  name: string
  size: number
}

function Avatar({ name, size }: Props) {
  type State =
    | { type: "idle" }
    | { type: "loading" }
    | { type: "success" }
    | { type: "error" }

  const [state, setState] = useState<State>({ type: "idle" })
  const image = useMemo(() => document.createElement("img"), [])

  useEffect(() => {
    setState({ type: "loading" })

    image.src = getAvatarUrl(name)

    if (image.complete) {
      setState({ type: "success" })
    } else {
      image.onload = () => setState({ type: "success" })
      image.onerror = () => setState({ type: "error" })
    }

    return () => {
      image.onload = null
      image.onerror = null
      setState({ type: "idle" })
    }
  }, [image, name])

  return (
    <TransitionGroup css={[relative]} style={{ width: size, height: size }}>
      {state.type === "success" && (
        <Transition key={name} timeout={{ appear: 1, enter: 200, exit: 200 }}>
          {(status) => (
            <img
              src={getAvatarUrl(name)}
              title={name}
              alt=""
              role="presentation"
              css={[
                w("full"),
                h("full"),
                absolute,
                transition("opacity", "transform"),
                status === "entered" ? opacity(100) : [opacity(0), scaleDown],
              ]}
            />
          )}
        </Transition>
      )}
    </TransitionGroup>
  )
}

export default Avatar
