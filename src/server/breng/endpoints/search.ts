import { brengApi } from "@breng/brengApi"
import { SearchResponse } from "@breng/types/search"
import { Cacher } from "@server/lib/Cacher"

const cache = new Cacher<SearchResponse>("search", brengApi)

export const search = async (query: string): Promise<SearchResponse> => {
	return await cache.request({
		url: "travelplanner/geo/search",
		searchParams: {
			q: query,
		},
	})
}
