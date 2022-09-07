import chalk from "chalk"
import got, { Response } from "got-cjs"
import { HeaderGenerator } from "header-generator"

const generatedHeaders = new HeaderGenerator().getHeaders()

export const http = got.extend({
	responseType: "json",

	headers: {
		"user-agent": generatedHeaders["user-agent"],
	},
	hooks: {
		afterResponse: [
			(response): Response => {
				const color = response.ok ? chalk.green : chalk.red

				console.log(
					chalk`${color(response.statusCode)} {yellow ${
						response.request.options.method
					}} {dim ${response.requestUrl}}`,
				)

				return response
			},
		],
	},
})
