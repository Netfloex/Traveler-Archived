import {
	GeneralSearchResult,
	GenericSearchResult,
	TransitSearchResult,
} from "@breng/types/search"
import Box from "@mui/joy/Box"
import Card from "@mui/joy/Card"
import SvgIcon from "@mui/joy/SvgIcon"
import Typography from "@mui/joy/Typography"

import { FC, useRef, useState } from "react"
import { MdArrowForward } from "react-icons/md"

import { LocationTextField, TravelPlan } from "@components"

export const Dashboard: FC = () => {
	const [from, setFrom] = useState<GenericSearchResult | false>(false)
	const [to, setTo] = useState<GenericSearchResult | false>(false)

	const cache = useRef<
		Map<string, Array<TransitSearchResult | GeneralSearchResult>>
	>(new Map())

	return (
		<>
			<Card variant="outlined">
				<Typography level="h3">Plan your trip</Typography>
				<Box
					sx={{
						display: "flex",
						flexWrap: "wrap",
						gap: 6,
					}}
				>
					<LocationTextField
						label="From"
						autoFocus
						selected={from}
						setSelected={setFrom}
						cache={cache}
					/>
					<LocationTextField
						label="To"
						selected={to}
						setSelected={setTo}
						cache={cache}
					/>
				</Box>
			</Card>
			{from && to && (
				<Card variant="outlined">
					<Box>
						<Typography
							level="h4"
							sx={{
								display: "flex",
								justifyItems: "center",
								alignItems: "center",
								flexDirection: "row",
							}}
						>
							{from.name}
							<SvgIcon component={MdArrowForward} />
							{to.name}
						</Typography>
					</Box>
					<TravelPlan from={from} to={to} />
				</Card>
			)}
		</>
	)
}
