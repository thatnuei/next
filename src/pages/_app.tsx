import { enableMapSet } from "immer"
import { AppProps } from "next/app"
import Head from "next/head"
import { Suspense } from "react"
import { ReactQueryConfig, ReactQueryConfigProvider } from "react-query"
import "../styles/index.css"

enableMapSet()

const reactQueryConfig: ReactQueryConfig = {
	queries: {
		retry: false,
		staleTime: Infinity,
	},
}

export default function App({ Component, pageProps }: AppProps) {
	return (
		<ReactQueryConfigProvider config={reactQueryConfig}>
			<Head>
				<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
				<title>next</title>
			</Head>
			<Suspense fallback={<p>Loading...</p>}>
				<Component {...pageProps} />
			</Suspense>
		</ReactQueryConfigProvider>
	)
}
