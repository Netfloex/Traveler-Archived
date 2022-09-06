import { brengApi } from "@breng/brengApi"
import { SearchResponse } from "@breng/types/search"

export const search = async (query: string): Promise<SearchResponse> => {
	const response: SearchResponse = await brengApi
		.get<SearchResponse>({
			url: "travelplanner/geo/search",
			searchParams: {
				q: query,
			},
		})
		.json()
	return response
}
