import { AppProps } from "next/app"
import Head from "next/head"
import "../styles/index.css"

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
				<title>next</title>
			</Head>
			<Component {...pageProps} />
		</>
	)
}
