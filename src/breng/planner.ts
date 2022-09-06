import { brengApi } from "@breng/brengApi"
import { PlannerLocation, PlannerResponse } from "@breng/types/planner"
import { DateTime } from "luxon"

import { createCacher } from "@utils/createCacher"

const cache = createCacher<PlannerResponse>("planner")

export const planner = async (
	date: DateTime,
	from: PlannerLocation,
	to: PlannerLocation,
): Promise<PlannerResponse> => {
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

	await cache.set(slug, response.body)

	return response.body
}
