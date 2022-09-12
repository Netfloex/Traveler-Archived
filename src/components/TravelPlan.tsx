import { PlannerResponse } from "@breng/types/planner"
import { GenericSearchResult } from "@breng/types/search"
import Card from "@mui/joy/Card"
import Typography from "@mui/joy/Typography"
import { plannerBodySchema } from "@schemas/plannerBodySchema"

import ky from "ky"
import { DateTime } from "luxon"
import { FC, useCallback, useEffect, useState } from "react"
import { z } from "zod"

import { searchToPlannerLocation } from "@utils/searchToPlannerLocation"

export const TravelPlan: FC<{
	from: GenericSearchResult
	to: GenericSearchResult
}> = ({ from, to }) => {
	const [travelPlan, updateTravelPlan] = useState<PlannerResponse | false>(
		false,
	)

	const formatTime = useCallback(
		(ms: number | undefined): string =>
			ms
				? DateTime.fromMillis(ms).toLocaleString(
						DateTime.TIME_24_SIMPLE,
				  )
				: "~~:~~",
		[],
	)

	useEffect(() => {
		const controller = new AbortController()

		const data: z.input<typeof plannerBodySchema> = {
			from: searchToPlannerLocation(from),
			to: searchToPlannerLocation(to),
			date: DateTime.now().toMillis(),
		}

		ky.post("/api/planner", {
			json: data,
			signal: controller.signal,
		})
			.json<PlannerResponse>()
			.then((data) => {
				updateTravelPlan(data)
			})

		return () => {
			console.log("Aborting Request")

			controller.abort()
		}
	}, [from, to])

	if (travelPlan == false) {
		return <>Loading...</>
	}
	const { itineraries } = travelPlan.result.result.plan

	return (
		<>
			{itineraries.map((itinerary) => (
				<Card
					sx={{ margin: "1rem" }}
					variant="soft"
					key={JSON.stringify(itinerary)}
				>
					<Typography level="h4">
						{formatTime(itinerary.startTime)}
						{"->"}
						{formatTime(itinerary.endTime)}
					</Typography>
					{itinerary.legs.map((leg) => (
						<div key={JSON.stringify(leg)}>
							{formatTime(leg.from.departure)}
							{"->"}
							{formatTime(leg.from.arrival)}
							<> </>
							{leg.mode}
							<> </>

							{leg.from.name}
							<> </>
							{"->"}
							<> </>
							{leg.to.name}
						</div>
					))}
				</Card>
			))}
			<pre>{JSON.stringify(travelPlan.result.result, null, "\t")}</pre>
		</>
	)
}
