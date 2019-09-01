import { Omit } from "lodash"
import "react-window"

declare module "react-window" {
  export const DynamicSizeList: React.ComponentType<
    Omit<FixedSizeListProps, "itemSize">
  >
}
