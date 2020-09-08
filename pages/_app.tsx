import { AppProps } from "next/app"
import Head from "next/head"
import { ReactQueryConfig, ReactQueryConfigProvider } from "react-query"
import "../styles/index.css"

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
			<Component {...pageProps} />
		</ReactQueryConfigProvider>
	)
}
