import { search } from "@breng/endpoints/search"

import { NextApiHandler } from "next"

const Search: NextApiHandler = async (req, res) => {
	if (Array.isArray(req.query.q)) {
		return res.json({ error: true })
	}

	const query = req.query.q ?? "Amsterdam"

	res.json(await search(query))
}

export default Search
