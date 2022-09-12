import { plannerLocationSchema } from "@schemas/plannerLocationSchema"

import { z } from "zod"

export const plannerBodySchema = z.object({
	from: plannerLocationSchema,
	to: plannerLocationSchema,
	date: z.number(),
})
