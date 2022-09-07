import { planner } from "@breng/endpoints/planner"
import { search } from "@breng/endpoints/search"
import chalk from "chalk"
import { HTTPError } from "got-cjs"
import { DateTime, Duration } from "luxon"

const concatString = (...array: Array<string | number | undefined>): string =>
	array.filter(Boolean).join(" ").replace(/\n\s*/g, "\n")

const cD: chalk.ChalkFunction = (...optionalText: unknown[]) => {
	const text = optionalText.filter(Boolean)

	if (text.length) return chalk.dim(...text)

	return ""
}

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

	// console.log(inspect(plan.itineraries[0], true, 10, true))
	plan.itineraries.forEach((itinerary) => {
		const formatTime = (ms: number | undefined): string =>
			ms
				? DateTime.fromMillis(ms).toLocaleString(
						DateTime.TIME_24_SIMPLE,
				  )
				: "~~:~~"

		console.log("\n\n")

		console.log(
			concatString(
				formatTime(itinerary.startTime),
				chalk.bold("->"),
				formatTime(itinerary.endTime),
			),
		)

		console.log(
			concatString(
				"\n",
				"Walkdistance: ",
				Math.round(itinerary.walkDistance) + "m",
				"\n",
				"Reduction:",
				"€" + itinerary.fare.fare.reduction.cents / 100,
				"\n",
				"Regular:",
				"€" + itinerary.fare.fare.regular.cents / 100,
				"\n",
				"Duration:",
				Duration.fromMillis(itinerary.duration * 1000)
					.shiftTo("minutes")
					.toHuman({ maximumFractionDigits: 0 }),
				"\n",
			),
		)
		itinerary.legs.forEach((leg) => {
			// console.log(leg)
			console.log(
				concatString(
					cD(formatTime(leg.from.departure)),
					"-",
					cD(formatTime(leg.from.arrival)),
					cD(leg.mode),
					"from",
					cD(leg.from.name),
					leg.from.platformCode &&
						`(Platform ${cD(leg.from.platformCode)})`,
					"to",
					cD(leg.to.name),
					leg.to.platformCode &&
						`(Platform ${cD(leg.to.platformCode)})`,
				),
			)
			if (leg.intermediateStops) {
				console.log("Itermediate stops:")

				leg.intermediateStops.forEach((stop) => {
					console.log(
						concatString(
							"\t",
							cD(formatTime(stop.arrival)),
							"-",
							cD(formatTime(stop.departure)),
							cD(stop.name),
						),
					)
				})
			}
		})
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
