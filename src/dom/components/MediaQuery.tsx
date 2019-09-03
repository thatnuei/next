import React from "react"
import useMedia from "../hooks/useMedia"

type Props = {
  query: string
  children?: React.ReactNode
}

export default function MediaQuery(props: Props) {
  const matches = useMedia(props.query)
  return matches ? <>{props.children}</> : null
}
