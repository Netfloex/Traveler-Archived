import got, { Response } from "got-cjs"

export const brengApi = got.extend({
	prefixUrl: "https://www.breng.nl/api",
	responseType: "json",
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
