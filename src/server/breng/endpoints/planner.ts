import { brengApi } from "@breng/brengApi"
import { PlannerLocation, PlannerResponse } from "@breng/types/planner"
import { Cacher } from "@server/lib/Cacher"

import { DateTime } from "luxon"

const cache = new Cacher<PlannerResponse>("planner", brengApi)

export const planner = async (
	date: DateTime,
	from: PlannerLocation,
	to: PlannerLocation,
): Promise<PlannerResponse> => {
	;[date, from, to].forEach((arg, i) => {
		if (!arg) {
			throw new TypeError("planner: Argument " + i + " is undefined")
		}
	})

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
