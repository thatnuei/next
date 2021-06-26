import type { ReactElement, ReactNode } from "react"
import { Route, useMatch } from "react-router-dom"

export default function TypedRoute<Path extends string>({
	path,
	render,
	children,
}: {
	path: Path
	render: (params: PathParams<Path>) => ReactElement
	children?: ReactNode
}) {
	const match = useMatch(path)
	const element = match ? render(match.params) : null

	return (
		<Route path={path} element={element}>
			{children}
		</Route>
	)
}

type PathParams<Path extends string> = Record<PathParamNames<Path>, string>

type PathParamNames<Path extends string> =
	Path extends `${infer Segment}/${infer Rest}`
		? PathSegmentParam<Segment> | PathParamNames<Rest>
		: Path extends `${infer Segment}`
		? PathSegmentParam<Segment>
		: never

type PathSegmentParam<Part extends string> = Part extends `:${infer ParamName}`
	? ParamName
	: never
