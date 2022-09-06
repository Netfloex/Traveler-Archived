import got from "got-cjs"

export const brengApi = got.extend({
	prefixUrl: "https://www.breng.nl/api",
})
