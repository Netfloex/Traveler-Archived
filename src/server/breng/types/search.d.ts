import { GeneralResponse } from "@breng/types/general"

type TransitSearchResultType = "busStation" | "railStation" | "onstreetBus"
type GeneralSearchResultType = "place" | "landuse" | "highway"

interface SearchLocation {
	latitude: number
	longitude: number
}

export interface GenericSearchResult {
	name: string
	location: SearchLocation
	type: TransitSearchResultType | GeneralSearchResultType
	city?: string
}

export interface TransitSearchResult extends GenericSearchResult {
	stopid: string
	type: TransitSearchResultType
}
export interface GeneralSearchResult extends GenericSearchResult {
	detailedType?: string
	type: GeneralSearchResultType
}

export type SearchResponse = GeneralResponse<
	| {
			transit: TransitSearchResult[]
			general: GeneralSearchResult[]
	  }
	| Record<string, never>
>
