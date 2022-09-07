import colors from "chalk"
import chalk from "chalk-template"
import got, { Response } from "got"
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
				const color = response.ok ? colors.green : colors.red

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
