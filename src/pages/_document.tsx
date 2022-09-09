// Next.js example
import { getInitColorSchemeScript } from "@mui/joy/styles"

import Document, { Html, Head, Main, NextScript } from "next/document"

export default class MyDocument extends Document {
	render = (): JSX.Element => (
		<Html>
			<Head />
			<body>
				{getInitColorSchemeScript()}
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}
