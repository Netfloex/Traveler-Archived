import { plannerBodySchema } from "./../../../schemas/plannerBodySchema"
import { searchBodySchema } from "./../../../schemas/searchBodySchema"
import { search } from "./../../../server/breng/endpoints/search"
import { planner } from "@breng/endpoints/planner"
import { initTRPC } from "@trpc/server"
import { createNextApiHandler } from "@trpc/server/adapters/next"

import { DateTime } from "luxon"

export const t = initTRPC.create()

export const appRouter = t.router({
	planner: t.procedure.input(plannerBodySchema).query(async ({ input }) => {
		return await planner(
			DateTime.fromMillis(input.date),
			input.from,
			input.to,
		)
	}),
	search: t.procedure.input(searchBodySchema).query(async ({ input }) => {
		const data = await search(input.query)
		return [
			...(data.result?.transit ?? []),
			...(data.result?.general ?? []),
		]
	}),
})

export type AppRouter = typeof appRouter

export default createNextApiHandler({
	router: appRouter,
	createContext: () => ({}),
})
