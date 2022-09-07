import { http } from "@server/utils/http"

export const brengApi = http.extend({
	prefixUrl: "https://www.breng.nl/api",
})
