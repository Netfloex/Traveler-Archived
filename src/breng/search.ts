import { brengApi } from "@breng/brengApi"
import { SearchResponse } from "@breng/types/search"

import { createCacher } from "@utils/createCacher"

const cache = createCacher<SearchResponse>("search")

export const search = async (query: string): Promise<SearchResponse> => {
	if (await cache.has(query)) {
		return await cache.get(query)
	}

	const response = await brengApi.get<SearchResponse>({
		url: "travelplanner/geo/search",
		searchParams: {
			q: query,
		},
	})

	return await cache.set(query, response.body)
}
