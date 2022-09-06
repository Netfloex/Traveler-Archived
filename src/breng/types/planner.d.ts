import { GeneralResponse } from "@breng/types/general"

export interface PlannerLocation {
	description: string
	lat: number
	lng: number
}

export type PlannerResponse = GeneralResponse<{
	planner: string
	// Todo
	result: {
		elevationMetadata
		metadata
		plan
		requestParameters
	}
}>
