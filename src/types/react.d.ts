import "react"

declare module "react" {
  export class ConcurrentMode extends Component {}

  function createContext<V>(): Context<V | undefined>
}
