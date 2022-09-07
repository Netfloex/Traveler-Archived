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
				console.log(
					`${response.statusCode} ${response.request.options.method} ${response.requestUrl}`,
				)

				return response
			},
		],
	},
})
