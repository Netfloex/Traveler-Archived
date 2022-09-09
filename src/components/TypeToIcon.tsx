import {
	TransitSearchResultType,
	GeneralSearchResultType,
} from "@breng/types/search"
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus"
import TrainIcon from "@mui/icons-material/Train"

import type { FC } from "react"

export const TypeToIcon: FC<{
	type: TransitSearchResultType | GeneralSearchResultType
}> = ({ type }) => {
	if (type == "busStation" || type == "onstreetBus")
		return <DirectionsBusIcon />
	if (type == "railStation") return <TrainIcon />
	return <>{type}</>
}
