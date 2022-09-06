import { PlannerLocation } from "@breng/types/planner"
import { GenericSearchResult } from "@breng/types/search"

export const searchToPlannerLocation = (
	searchResult: GenericSearchResult,
): PlannerLocation => ({
	description: searchResult.name,
	lat: searchResult.location.latitude,
	lng: searchResult.location.longitude,
})
