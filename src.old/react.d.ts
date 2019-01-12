import "react"

declare module "react" {
  export class ConcurrentMode extends Component {}

  function useState<S>(): [
    S | undefined,
    Dispatch<SetStateAction<S | undefined>>
  ]

  function useRef<T>(): MutableRefObject<T | undefined>

  function createContext<V>(): Context<V | undefined>
}
