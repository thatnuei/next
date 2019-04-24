import "react-window"

declare module "react-window" {
  export const DynamicSizeList: React.ComponentType<{
    width: number
    height: number
    itemCount: number
    children: (info: {
      index: number
      style: React.CSSProperties
    }) => React.ReactNode
  }>
}
