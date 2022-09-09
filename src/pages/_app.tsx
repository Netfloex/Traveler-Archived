import Button from "@mui/joy/Button"
import { CssVarsProvider } from "@mui/joy/styles"
import { useColorScheme } from "@mui/joy/styles"
import { FCC } from "@typings/FCC"

import { DefaultSeo } from "next-seo"
import type { AppProps } from "next/app"
import Head from "next/head"

import SEO from "@seo-default"

const App = ({ Component, pageProps }: AppProps): JSX.Element => (
	<>
		<DefaultSeo {...SEO} />
		<Head>
			<link rel="manifest" href="/manifest.json" />
		</Head>
		<CssVarsProvider defaultMode="system">
			<Component {...pageProps} />
		</CssVarsProvider>
	</>
)

export default App
