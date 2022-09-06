type TransitSearchResultType = "busStation" | "railStation" | "onstreetBus"
type GeneralSearchResultType = "place" | "landuse" | "highway"

interface SearchLocation {
	latitude: number
	longitude: number
}

export interface GenericSearchResult {
	name: string
	location: SearchLocation
	type: SearchResultType
	city?: string
}

export interface TransitSearchResult extends GenericSearchResult {
	stopid: string
	type: TransitSearchResultType
}
export interface GeneralSearchResult extends GenericSearchResult {
	detailedType?: string
}

export interface SearchResponse {
	result: {
		transit: TransitSearchResult[]
		general: GeneralSearchResult[]
	}
	statusCode: number
}
