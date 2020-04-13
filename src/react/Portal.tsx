import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom"

type Props = { children: React.ReactNode }

function Portal(props: Props) {
  const [container, setContainer] = useState<HTMLElement>()

  useEffect(() => {
    const el = document.createElement("div")
    document.body.append(el)
    setContainer(el)
    return () => el.remove()
  }, [])

  return container ? ReactDOM.createPortal(props.children, container) : null
}

export default Portal
