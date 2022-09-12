import { z } from "zod"

export const plannerLocationSchema = z.object({
	description: z.string(),
	lat: z.number(),
	lng: z.number(),
})
