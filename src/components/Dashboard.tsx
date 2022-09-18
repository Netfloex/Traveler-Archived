import {
	GeneralSearchResult,
	GenericSearchResult,
	TransitSearchResult,
} from "@breng/types/search"
import Card from "@mui/joy/Card"
import SvgIcon from "@mui/joy/SvgIcon"
import Typography from "@mui/joy/Typography"

import styles from "./Dashboard.module.scss"

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
		<div className={styles.wrapper}>
			<Card variant="outlined" className={styles.locationSearch}>
				<Typography level="h3">Plan your trip</Typography>
				<div className={styles.textFieldWrapper}>
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
				</div>
			</Card>
			{from && to && (
				<Card variant="outlined">
					<div>
						<Typography level="h4" className={styles.textWithIcon}>
							{from.name}
							<SvgIcon component={MdArrowForward} />
							{to.name}
						</Typography>
					</div>
					<TravelPlan from={from} to={to} />
				</Card>
			)}
		</div>
	)
}
