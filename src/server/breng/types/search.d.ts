import { GeneralResponse } from "@breng/types/general"

type TransitSearchResultType =
	| "busStation"
	| "railStation"
	| "onstreetBus"
	| "onstreetTram"
	| "metroStation"
	| "ferryPort"
	| "tramStation"
	| "combiTramBus"
type GeneralSearchResultType =
	| "place"
	| "landuse"
	| "highway"
	| "natural"
	| "amenity"
	| "shop"
	| "building"
	| "leisure"
	| "office"
	| "tourism"
	| "man_made"
	| "historic"
	| "other"

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
	country: string
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
