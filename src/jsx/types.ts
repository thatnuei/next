/** Get the props for a given DOM element tag
 *
 * here to keep JSX mostly agnostic from react, and for less typing */
export type TagProps<T extends keyof JSX.IntrinsicElements> =
	React.ComponentPropsWithoutRef<T>

/** Get the props for a component
 *
 * here to keep JSX mostly agnostic from react, and for less typing */
export type ComponentProps<C extends React.ComponentType> =
	React.ComponentPropsWithoutRef<C>

export interface ChildrenProps {
	children: React.ReactNode
}
