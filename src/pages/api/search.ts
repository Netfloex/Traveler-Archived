import { search } from "@breng/endpoints/search"
import { SearchResponse } from "@breng/types/search"

import { NextApiHandler } from "next"

const Search: NextApiHandler<{ error: string } | SearchResponse> = async (
	req,
	res,
) => {
	const query = Array.isArray(req.query.q) ? req.query.q[0] : req.query.q

	if (!query) {
		return res.status(400).json({ error: "There is no query" })
	}

	await search(query)
		.then(res.json)
		.catch((err) => {
			res.status(504).json({ error: err.message })
			throw err
		})
}

export default Search
