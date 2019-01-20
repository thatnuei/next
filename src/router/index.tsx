import { createLocation, History, Location } from "history"
import createBrowserHistory from "history/createBrowserHistory"
import pathToRegexp, { PathRegExp } from "path-to-regexp"
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
  const [history] = useState(() => createBrowserHistory())
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
  path?: string
  exact?: boolean
  children?: React.ReactNode
}

export const Route = ({ path, exact = false, children }: RouteProps) => {
  const { history, location } = useRouter()

  let _match: RegExpMatchArray | null
  let regexp: PathRegExp | undefined
  if (!path) {
    _match = [location.pathname]
  } else {
    regexp = pathToRegexp(path, { end: exact })
    _match = location.pathname.match(regexp)
  }

  const match = _match
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

export const Switch = ({ children }: { children: React.ReactElement<any>[] }) => {
  const { location } = useRouter()

  const matchingRoute = children.find((element) => {
    if (element.type === Redirect && !element.props.from) return true
    if (element.type === Route && !element.props.path) return true

    const { path, from, exact = false } = element.props
    if (typeof path !== "string" && typeof from !== "string") return false

    const regexp = pathToRegexp(path || from, { end: exact })
    const match = location.pathname.match(regexp)
    if (!match) return false

    return true
  })

  return matchingRoute || null
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
