import { createLocation, History, Location } from "history"
import createBrowserHistory from "history/createBrowserHistory"
import pathToRegexp from "path-to-regexp"
import React, { useContext, useEffect, useState } from "react"
import tuple from "../common/tuple"

type RouterContextType = {
  history: History
  location: Location
  param: (name: string) => string
}

const RouterContext = React.createContext<RouterContextType>()

export const Router: React.FC = ({ children }) => {
  const [history] = useState(() => createBrowserHistory())
  const [location, setLocation] = useState(history.location)

  useEffect(() => history.listen(setLocation))

  const param = () => ""

  return (
    <RouterContext.Provider value={{ history, location, param }}>{children}</RouterContext.Provider>
  )
}

export const Route: React.FC<{ path: string }> = ({ path, children }) => {
  const { history, location } = useRouter()

  const regexp = pathToRegexp(path, { end: false })

  const match = location.pathname.match(regexp)
  if (!match) return null

  const paramsMap = new Map(
    regexp.keys.map((key, index) => tuple(String(key.name), match[index + 1])),
  )

  const param = (name: string) => paramsMap.get(name) || ""

  return (
    <RouterContext.Provider value={{ history, location, param }}>{children}</RouterContext.Provider>
  )
}

type LinkProps = React.ComponentPropsWithoutRef<"a"> & { to: string }

export const Link = ({ to, children, href: _, onClick, ...props }: LinkProps) => {
  const { history } = useRouter()

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(event)
    event.preventDefault()
    history.push(to)
  }

  const location = createLocation(to, undefined, undefined, history.location)
  const href = history.createHref(location)

  return (
    <a {...props} href={href} onClick={handleClick}>
      {children}
    </a>
  )
}

export function useRouter() {
  const router = useContext(RouterContext)
  if (!router) throw new Error("Router context not found")
  return router
}
