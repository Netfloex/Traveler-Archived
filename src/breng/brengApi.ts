import { http } from "@utils/http"

export const brengApi = http.extend({
	prefixUrl: "https://www.breng.nl/api",
})
