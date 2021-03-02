import { ChildrenProps } from "../jsx/types"

export type TestProvidersProps = ChildrenProps

// TODO: allow overriding root store
export default function TestProviders({ children }: TestProvidersProps) {
	return <>{children}</>
}
