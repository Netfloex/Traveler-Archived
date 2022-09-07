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
		elevationMetadata: ElevationMetadata
		metadata: Metadata
		plan: Plan
		requestParameters: RequestParameters
	}
}>

interface ElevationMetadata {
	ellipsoidToGeoidDifference: number
	geoidElevation: boolean
}

interface Metadata {
	nextDateTime: number
	prevDateTime: number
	searchWindowUsed: number
}

interface Plan {
	date: number
	from: StartOrEndpoint
	itineraries: Itinerary[]
	to: StartOrEndpoint
}

interface RequestParameters {
	arriveBy: "False" | "True"
	date: string
	fromPlace: string
	maxWalkDistance: string
	mode: string
	numItineraries: string
	optimize: string
	showIntermediateStops: "true" | "false"
	time: string
	toPlace: string
	walkSpeed: string
	wheelchair: string
}

interface StartOrEndpoint {
	lat: number
	lon: number
	name: string
	vertexType: string
}

interface Itinerary {
	arrivedAtDestinationWithRentedBicycle: boolean
	duration: number
	elevationGained: number
	elevationLost: number
	emission: {
		co2: number
	}
	endTime: number
	fare: {
		fare: {
			reduction: ItineraryFare
			regular: ItineraryFare
		}
	}
	generalizedCost: number
	legs: Leg[]
	startTime: number
	tooSloped: boolean
	transfers: number
	transitTime: number
	waitingTime: number
	walkDistance: number
	walkLimitExceeded: boolean
	walkTime: number
}

interface ItineraryFare {
	cents: number
	currency: Currency
}

interface Currency {
	currency: string
	currencyCode: string
	defaultFractionDigits: number
	symbol: string
}

interface Leg {
	agencyTimeZoneOffset: number
	arrivalDelay: number
	departureDelay: number
	distance: number
	duration: number
	endTime: number
	fare?: LegFare
	from: LegStartOrEndpoint
	generalizedCost: number
	interlineWithPreviousLeg?: boolean
	legGeometry: LegGeometry
	mode: string
	pathway: boolean
	realTime: boolean
	rentedBike?: boolean
	route: string
	startTime: number
	steps: Step[]
	to: LegStartOrEndpoint
	transitLeg: boolean
	walkingBike?: boolean
	agencyId?: string
	agencyName?: string
	agencyUrl?: string
	headsign?: string
	intermediateStops?: IntermediateStop[]
	routeId?: string
	routeLongName?: string
	routeShortName?: string
	serviceDate?: string
	tripId?: string
	tripShortName?: string
}

interface LegFare {
	reduction: CostCalculation
	regular: CostCalculation
	fullFirstClass?: number
	fullSecondClass?: number
	reductionFirstClass?: number
	reductionSecondClass?: number
}

interface CostCalculation {
	base_price: number
	km_price: number
}

interface LegGeometry {
	length: number
	points: string
}

interface Step {
	absoluteDirection: string
	area: boolean
	bogusName: boolean
	distance: number
	elevation: string
	lat: number
	lon: number
	relativeDirection: string
	stayOn: boolean
	streetName: string
}

interface LegStartOrEndpoint {
	arrival?: number
	departure?: number
	lat: number
	lon: number
	name: string
	platformCode?: string
	stopId?: string
	stopIndex?: number
	stopSequence?: number
	vertexType: string
	zoneId?: string
	stopCode?: string
}

type IntermediateStop = Required<Omit<LegStartOrEndpoint, "platformCode">>
