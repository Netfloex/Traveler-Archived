import { planner } from "@breng/endpoints/planner"
import { PlannerResponse } from "@breng/types/planner"
import { plannerBodySchema } from "@schemas/plannerBodySchema"

import { DateTime } from "luxon"
import { NextApiHandler } from "next"
import { ZodError } from "zod"

const Planner: NextApiHandler<
	{ error: string } | PlannerResponse | ZodError
> = async (req, res) => {
	const body = plannerBodySchema.safeParse(req.body)

	if (!body.success) {
		return res.status(400).json(body.error)
	}

	await planner(
		DateTime.fromMillis(body.data.date),
		body.data.from,
		body.data.to,
	)
		.then(res.json)
		.catch((err) => {
			res.json({ error: err.message })
			throw err
		})
}

export default Planner
