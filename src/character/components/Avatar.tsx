import React, {
  ComponentPropsWithoutRef,
  useCallback,
  useMemo,
  useState,
} from "react"
import { getAvatarUrl } from "../../flist/helpers"
import { styled } from "../../ui/styled"

type Props = ComponentPropsWithoutRef<"img"> & {
  name: string
  size?: number
}

const Avatar = (
  { name, size, ...props }: Props,
  ref: React.Ref<HTMLImageElement>,
) => {
  const [loaded, setLoaded] = useState(false)

  const handleLoad = useCallback(() => setLoaded(true), [])

  const style = useMemo(() => ({ opacity: loaded ? 1 : 0 }), [loaded])

  return (
    <Image
      src={getAvatarUrl(name)}
      width={size || 100}
      height={size || 100}
      style={style}
      title={name}
      onLoad={handleLoad}
      alt=""
      role="presentation"
      ref={ref}
      {...props}
    />
  )
}
export default React.forwardRef(Avatar)

const Image = styled.img`
  transition: 0.2s opacity;
`
