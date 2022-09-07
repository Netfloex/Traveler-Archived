import { planner } from "@breng/endpoints/planner"
import { search } from "@breng/endpoints/search"
import chalk from "chalk"
import { HTTPError } from "got-cjs"
import { DateTime } from "luxon"

const main = async (): Promise<void> => {
	const amsterdam = await search("Amsterdam")
	const rotterdam = await search("Rotterdam")

	const plan = (
		await planner(
			DateTime.now(),
			amsterdam.result.transit[0],
			rotterdam.result.transit[0],
		)
	).result.result.plan

	console.log(
		chalk`{underline ${amsterdam.result.transit[0].name} {bold ->} ${rotterdam.result.transit[0].name}}`,
	)

	plan.itineraries.forEach((itinerary) => {
		console.log(
			chalk`${DateTime.fromMillis(itinerary.startTime).toLocaleString(
				DateTime.TIME_24_SIMPLE,
			)} {bold ->} ${DateTime.fromMillis(
				itinerary.endTime,
			).toLocaleString(DateTime.TIME_24_SIMPLE)}`,
		)
	})
}

const started = Date.now()
main()
	.catch((err) => {
		if (err instanceof HTTPError) {
			console.error(err)

			console.log(chalk`{red Message}:`, err.message)
			console.log(chalk`{red Response}:`, err.response)
		} else console.error(err)
	})
	.then(() => {
		console.log(
			chalk`{green Done} in {yellow ${(Date.now() - started) / 1000}s}`,
		)
	})
