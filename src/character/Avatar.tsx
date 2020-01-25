import React, { useEffect, useMemo, useState } from "react"
import { Transition, TransitionGroup } from "react-transition-group"
import { getAvatarUrl } from "../flist/helpers"

type Props = {
  name: string
  size: number
}

function Avatar({ name, size }: Props) {
  const image = useMemo(() => document.createElement("img"), [])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(false)

    image.src = getAvatarUrl(name)

    if (image.complete) {
      setLoaded(true)
    } else {
      image.onload = () => setLoaded(true)
      image.onerror = () => {
        /* show some other "failed to load" placeholder? */
      }
    }

    return () => {
      image.onload = null
      image.onerror = null
    }
  }, [image, name])

  return (
    <TransitionGroup
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {loaded && (
        <Transition key={name} timeout={{ appear: 1, enter: 200, exit: 200 }}>
          {(status) => (
            <img
              src={getAvatarUrl(name)}
              title={name}
              alt=""
              role="presentation"
              className={`w-full h-full absolute transition-normal ${
                status === "entered" ? "opacity-100" : "opacity-0 scale-down"
              }`}
            />
          )}
        </Transition>
      )}
    </TransitionGroup>
  )
}

export default Avatar
