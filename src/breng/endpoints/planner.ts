import { brengApi } from "@breng/brengApi"
import { PlannerLocation, PlannerResponse } from "@breng/types/planner"
import { GenericSearchResult } from "@breng/types/search"
import { searchToPlannerLocation } from "@breng/utils/searchToPlannerLocation"
import { DateTime } from "luxon"

import { Cacher } from "@lib/Cacher"

const cache = new Cacher<PlannerResponse>("planner", brengApi)

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

	return await cache.request({
		url: "travelplanner/planner",
		searchParams: {
			arrive: false,
			time: timeString,
			date: dateString,
			from: JSON.stringify(from),
			to: JSON.stringify(to),
		},
	})
}
