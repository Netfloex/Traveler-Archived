import { search } from "@breng/search"
import { HTTPError } from "got-cjs"

const main = async (): Promise<void> => {
	const res = await search("Amsterdam")
	console.log(res)
}

main().catch((err) => {
	if (err instanceof HTTPError) {
		console.error(err)

		console.log(err.message)
	} else console.error(err)
})
