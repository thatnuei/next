declare module "@reach/rect" {
  export function useRect<E>(
    ref: React.Ref<E>,
    observe?: boolean,
  ): DOMRect | null
}
