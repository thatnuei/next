import React, { useContext } from "react"
import { Route, RouteComponentProps } from "react-router"

const RouterContext = React.createContext<RouteComponentProps>()

export const RouterProvider: React.FC = ({ children }) => (
  <Route
    render={(props) => <RouterContext.Provider value={props}>{children}</RouterContext.Provider>}
  />
)

export function useRouter() {
  const router = useContext(RouterContext)
  if (!router) throw new Error("Router context not found")
  return router
}
