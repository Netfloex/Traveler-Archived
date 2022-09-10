import {
	TransitSearchResultType,
	GeneralSearchResultType,
} from "@breng/types/search"
import SvgIcon from "@mui/joy/SvgIcon"

import type { FC } from "react"
import { IconType } from "react-icons"
import {
	MdTrain,
	MdDirectionsBus,
	MdSubway,
	MdStore,
	MdTimeToLeave,
	MdPlace,
	MdRestaurant,
	MdPark,
	MdDirectionsBoat,
	MdLandscape,
	MdBusiness,
	MdTram,
	MdWeekend,
	MdWork,
	MdBeachAccess,
	MdEmojiPeople,
	MdHistory,
} from "react-icons/md"

const typeToIconMap: Record<
	TransitSearchResultType | GeneralSearchResultType,
	IconType
> = {
	busStation: MdDirectionsBus,
	onstreetBus: MdDirectionsBus,

	railStation: MdTrain,

	metroStation: MdSubway,

	tramStation: MdTram,
	onstreetTram: MdTram,

	shop: MdStore,
	highway: MdTimeToLeave,
	place: MdPlace,
	amenity: MdRestaurant,
	natural: MdPark,
	ferryPort: MdDirectionsBoat,
	landuse: MdLandscape,
	building: MdBusiness,
	leisure: MdWeekend,
	office: MdWork,
	tourism: MdBeachAccess,
	man_made: MdEmojiPeople,
	combiTramBus: MdTram,
	historic: MdHistory,
	other: MdPlace,
}

export const TypeToIcon: FC<{
	type: TransitSearchResultType | GeneralSearchResultType
}> = ({ type }) => {
	const icon = typeToIconMap[type]
	if (icon) return <SvgIcon component={icon}></SvgIcon>
	console.log(
		type + " is not in the list of known types! There is no icon for it",
	)
	return <>{type}</>
}
