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

const defaultParam = () => ""

export const Router: React.FC = ({ children }) => {
  const history = useState(() => createBrowserHistory())[0]
  const [location, setLocation] = useState(history.location)

  useEffect(() => {
    setLocation(history.location)
  }, [])

  useEffect(() => {
    return history.listen(setLocation)
  })

  return (
    <RouterContext.Provider value={{ history, location, param: defaultParam }}>
      {children}
    </RouterContext.Provider>
  )
}

type RouteProps = {
  path: string
  partial?: boolean
  children?: React.ReactNode
}

export const Route = ({ path, partial = false, children }: RouteProps) => {
  const { history, location } = useRouter()

  const regexp = pathToRegexp(path, { end: !partial })
  const match = location.pathname.match(regexp)
  if (!match) return null

  const paramPairs = regexp
    ? regexp.keys.map((key, index) => tuple(String(key.name), match[index + 1]))
    : undefined

  const paramsMap = new Map(paramPairs)
  const param = (name: string) => paramsMap.get(name) || ""

  return (
    <RouterContext.Provider value={{ history, location, param }}>{children}</RouterContext.Provider>
  )
}

type LinkProps = React.ComponentPropsWithoutRef<"a"> & {
  to: string
}

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

type SwitchProps = {
  children: React.ReactElement<any>[]
  default?: React.ReactNode
}

export const Switch = ({ children, default: defaultElement }: SwitchProps) => {
  const { location } = useRouter()

  const matchingRoute = children.find((element) => {
    const { path, from, partial = false } = element.props
    if (typeof path !== "string" && typeof from !== "string") return false

    const regexp = pathToRegexp(path || from, { end: !partial })
    const match = location.pathname.match(regexp)
    if (!match) return false

    return true
  })

  return matchingRoute || (defaultElement && <>{defaultElement}</>) || null
}

export const Redirect = ({ from, to }: { from?: string; to: string }) => {
  const { history, location } = useRouter()

  let matches: boolean

  if (!from) {
    matches = true
  } else {
    const regexp = pathToRegexp(from, { end: false })
    const match = location.pathname.match(regexp)
    matches = match != null
  }

  useEffect(
    () => {
      if (matches) history.push(to)
    },
    [matches],
  )

  return null
}

export function useRouter() {
  const router = useContext(RouterContext)
  if (!router) throw new Error("Router context not found")
  return router
}
