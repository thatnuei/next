import React from "react"
import useMedia from "../dom/useMedia"

type Props = {
  query: string
  children?: React.ReactNode
}

export default function MediaQuery(props: Props) {
  const matches = useMedia(props.query)
  return matches ? <>{props.children}</> : null
}
