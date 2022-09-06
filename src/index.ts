import { planner } from "@breng/planner"
import { search } from "@breng/search"
import { HTTPError } from "got-cjs"
import { DateTime } from "luxon"

import { searchToPlannerLocation } from "@utils/searchToPlannerLocation"

const main = async (): Promise<void> => {
	const nijmegen = await search("Nijmegen")
	const diedenweg = await search("Diedenweg")

	console.log(
		await planner(
			DateTime.now(),
			searchToPlannerLocation(nijmegen.result.transit[0]),
			searchToPlannerLocation(diedenweg.result.transit[0]),
		),
	)
}

const started = Date.now()
main()
	.catch((err) => {
		if (err instanceof HTTPError) {
			console.error(err)

			console.log(err.message)
		} else console.error(err)
	})
	.then(() => {
		console.log(`Done in ${(Date.now() - started) / 1000}s`)
	})
