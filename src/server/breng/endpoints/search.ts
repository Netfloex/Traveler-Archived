import { brengApi } from "@breng/brengApi"
import { SearchResponse } from "@breng/types/search"
import { Cacher } from "@server/lib/Cacher"

const cache = new Cacher<SearchResponse>("search", brengApi)

export const search = async (query: string): Promise<SearchResponse> => {
	if (!query) {
		throw new TypeError("search: query is undefined")
	}

	return await cache.request({
		url: "travelplanner/geo/search",
		searchParams: {
			q: query,
		},
	})
}
