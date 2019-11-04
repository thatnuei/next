import React, {
  ComponentPropsWithoutRef,
  useEffect,
  useRef,
  useState,
} from "react"
import { getAvatarUrl } from "../../flist/helpers"
import { styled } from "../../ui/styled"

type Props = ComponentPropsWithoutRef<"img"> & {
  name: string
  size?: number
}

const Avatar = ({ name, size = 100, ...props }: Props) => {
  const imageRef = useRef<HTMLImageElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (imageRef.current && imageRef.current.complete) {
      setLoaded(true)
    }
  }, [])

  return (
    <Image
      src={getAvatarUrl(name)}
      style={{ width: size, height: size, opacity: loaded ? 1 : 0 }}
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

const Image = styled.img`
  transition: 0.2s opacity;
`
