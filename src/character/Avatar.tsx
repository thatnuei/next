import React, {
  ComponentPropsWithoutRef,
  useCallback,
  useMemo,
  useState,
} from "react"
import { getAvatarUrl } from "../flist/helpers"
import { semiBlack } from "../ui/colors"
import { styled } from "../ui/styled"

type Props = ComponentPropsWithoutRef<"img"> & {
  name: string
  size?: number
}

const Avatar = (
  { name, size, ...props }: Props,
  ref: React.Ref<HTMLImageElement>,
) => {
  const [loaded, setLoaded] = useState(false)

  const style = useMemo(() => ({ opacity: loaded ? 1 : 0 }), [loaded])

  const handleLoad = useCallback(() => setLoaded(true), [])

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
  filter: drop-shadow(0 2px 4px ${semiBlack(0.3)});
  transition: 0.2s opacity;
`
