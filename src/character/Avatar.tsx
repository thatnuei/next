import React, {
  ComponentPropsWithoutRef,
  useEffect,
  useRef,
  useState,
} from "react"
import { getAvatarUrl } from "../flist/helpers"

type Props = ComponentPropsWithoutRef<"img"> & {
  name: string
  size?: number
}

function Avatar({ name, size = 100, ...props }: Props) {
  const imageRef = useRef<HTMLImageElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (imageRef.current && imageRef.current.complete) {
      setLoaded(true)
    }
  }, [])

  const style = {
    transition: "0.2s opacity",
    width: size,
    height: size,
    opacity: loaded ? 1 : 0,
  }

  return (
    <img
      src={getAvatarUrl(name)}
      style={style}
      title={name}
      onLoad={() => setLoaded(true)}
      alt=""
      role="presentation"
      ref={imageRef}
      {...props}
    />
  )
}

export default Avatar
