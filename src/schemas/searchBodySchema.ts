import { z } from "zod"

export const searchBodySchema = z.object({ query: z.string() })
