import { planner } from "@breng/planner"
import { search } from "@breng/search"
import { HTTPError } from "got-cjs"
import { DateTime } from "luxon"

const main = async (): Promise<void> => {
	const amsterdam = await search("Amsterdam")
	const rotterdam = await search("Rotterdam")

	console.log(
		(
			await planner(
				DateTime.now(),
				amsterdam.result.transit[0],
				rotterdam.result.transit[0],
			)
		).result.result.requestParameters,
	)
}

const started = Date.now()
main()
	.catch((err) => {
		if (err instanceof HTTPError) {
			console.error(err)

			console.log("Message:", err.message)
			console.log("Response:", err.response)
		} else console.error(err)
	})
	.then(() => {
		console.log(`Done in ${(Date.now() - started) / 1000}s`)
	})
