import { search } from "@breng/endpoints/search"

import { NextApiHandler } from "next"

const Search: NextApiHandler = async (req, res) => {
	if (Array.isArray(req.query.q)) {
		return res.json({ error: true })
	}

	const query = req.query.q || "Amsterdam"
	await search(query)
		.then(res.json)
		.catch((err) => {
			res.json({ error: err.message })
			throw err
		})
}

export default Search
