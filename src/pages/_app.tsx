import { enableMapSet } from "immer"
import { AppProps } from "next/app"
import Head from "next/head"
import { Suspense } from "react"
import { ErrorBoundary, FallbackProps } from "react-error-boundary"
import { ReactQueryConfig, ReactQueryConfigProvider } from "react-query"
import "../styles/index.css"

enableMapSet()

const reactQueryConfig: ReactQueryConfig = {
	queries: {
		retry: false,
		staleTime: Infinity,
	},
}

export default function App({ Component, pageProps, router }: AppProps) {
	const page = <Component {...pageProps} />

	return (
		<ReactQueryConfigProvider config={reactQueryConfig}>
			<Head>
				<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
				<title>next</title>
			</Head>
			{router.isSsr ? (
				<ErrorBoundary FallbackComponent={ErrorFallback}>{page}</ErrorBoundary>
			) : (
				<Suspense fallback={<p>Loading...</p>}>{page}</Suspense>
			)}
		</ReactQueryConfigProvider>
	)
}

function ErrorFallback(props: FallbackProps) {
	if (isPromise(props.error as any)) {
		return <p>Loading...</p>
	}
	throw props.error
}

function isPromise(value: undefined | null | { then?: unknown }) {
	return typeof value?.then === "function"
}
