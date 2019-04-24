import React, { useCallback, useMemo, useState } from "react"
import { getAvatarUrl } from "../flist/helpers"
import { semiBlack } from "../ui/colors"
import { styled } from "../ui/styled"

type Props = {
  name: string
  size?: number
}

const Avatar = (props: Props) => {
  const [loaded, setLoaded] = useState(false)

  const style = useMemo(() => ({ opacity: loaded ? 1 : 0 }), [loaded])

  const handleLoad = useCallback(() => setLoaded(true), [])

  return (
    <Image
      src={getAvatarUrl(props.name)}
      width={props.size || 100}
      height={props.size || 100}
      style={style}
      title={props.name}
      onLoad={handleLoad}
      alt=""
      role="presentation"
    />
  )
}
export default Avatar

const Image = styled.img`
  filter: drop-shadow(0 2px 4px ${semiBlack(0.3)});
  transition: 0.2s opacity;
`
