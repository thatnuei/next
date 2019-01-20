import { createBrowserHistory, createLocation, History, Location } from "history"
import pathToRegexp from "path-to-regexp"
import React, { useContext, useEffect, useState } from "react"
import tuple from "../common/tuple"

type RouterContextType = {
  history: History
  location: Location
}

const RouterContext = React.createContext<RouterContextType>()

export const Router: React.FC<{ history?: History }> = (props) => {
  const history = useState(() => props.history || createBrowserHistory())[0]
  const [location, setLocation] = useState(history.location)

  useEffect(() => {
    setLocation(history.location)
  }, [])

  useEffect(() => {
    return history.listen(setLocation)
  })

  return (
    <RouterContext.Provider value={{ history, location }}>{props.children}</RouterContext.Provider>
  )
}

type ParamFn = (paramName: string) => string

type RouteProps = {
  path: string
  partial?: boolean
  render?: (param: ParamFn) => React.ReactNode
  children?: React.ReactNode
}

export const Route = ({ path, partial = false, children, render }: RouteProps) => {
  const { history, location } = useRouter()

  const keys: pathToRegexp.Key[] = []
  const regexp = pathToRegexp(path, keys, { end: !partial })
  const match = location.pathname.match(regexp)
  if (!match) return null

  const paramPairs = regexp
    ? keys.map((key, index) => tuple(String(key.name), match[index + 1]))
    : undefined

  const paramsMap = new Map(paramPairs)
  const param: ParamFn = (name) => paramsMap.get(name) || ""

  const context = { history, location }

  const elements = render ? render(param) : children

  return <RouterContext.Provider value={context}>{elements}</RouterContext.Provider>
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
  children: React.ReactNode
  default?: React.ReactNode
}

export const Switch = ({ children, default: defaultElement }: SwitchProps) => {
  const { location } = useRouter()

  const matchingRoute = React.Children.toArray(children).find((element) => {
    if (!React.isValidElement<any>(element)) return false

    const { path, from, partial = false } = element.props
    if (typeof path !== "string" && typeof from !== "string") return false

    const regexp = pathToRegexp(path || from, undefined, { end: !partial })
    const match = location.pathname.match(regexp)
    if (!match) return false

    return true
  })

  if (matchingRoute) return <>{matchingRoute}</>
  if (defaultElement) return <>{defaultElement}</>
  return null
}

type RedirectProps = {
  from?: string
  partial?: boolean
  to: string
}

export const Redirect = ({ from, partial = false, to }: RedirectProps) => {
  const { history, location } = useRouter()

  let matches: boolean

  if (!from) {
    matches = true
  } else {
    const regexp = pathToRegexp(from, undefined, { end: !partial })
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
