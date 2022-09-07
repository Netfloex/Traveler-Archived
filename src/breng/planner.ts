import { brengApi } from "@breng/brengApi"
import { PlannerLocation, PlannerResponse } from "@breng/types/planner"
import { GenericSearchResult } from "@breng/types/search"
import { DateTime } from "luxon"

import { createCacher } from "@utils/createCacher"
import { searchToPlannerLocation } from "@utils/searchToPlannerLocation"

const cache = createCacher<PlannerResponse>("planner")

export const planner = async (
	date: DateTime,
	from: PlannerLocation | GenericSearchResult,
	to: PlannerLocation | GenericSearchResult,
): Promise<PlannerResponse> => {
	;[date, from, to].forEach((arg, i) => {
		if (!arg) {
			throw new TypeError("planner: Argument " + i + " is undefined")
		}
	})
	if ("name" in from) {
		from = searchToPlannerLocation(from)
	}
	if ("name" in to) {
		to = searchToPlannerLocation(to)
	}

	const timeString = date.toFormat("T")
	const dateString = date.toFormat("dd-MM-y")

	const slug = from.description + "-" + to.description

	if (await cache.has(slug)) {
		return await cache.get(slug)
	}

	const response = await brengApi.get<PlannerResponse>({
		url: "travelplanner/planner",
		searchParams: {
			arrive: false,
			time: timeString,
			date: dateString,
			from: JSON.stringify(from),
			to: JSON.stringify(to),
		},
	})

	return await cache.set(slug, response.body)
}
