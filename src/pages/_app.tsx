import { CssVarsProvider, extendTheme } from "@mui/joy/styles"

import { DefaultSeo } from "next-seo"
import { AppType } from "next/dist/shared/lib/utils"
import Head from "next/head"

import { trpc } from "@utils/trpc"

import SEO from "@seo-default"

const App: AppType = ({ Component, pageProps }) => (
	<>
		<DefaultSeo {...SEO} />
		<Head>
			<link rel="manifest" href="/manifest.json" />
		</Head>
		<CssVarsProvider
			defaultMode="system"
			theme={extendTheme({ cssVarPrefix: "" })}
		>
			<Component {...pageProps} />
		</CssVarsProvider>
	</>
)

export default trpc.withTRPC(App)
