import { PlannerResponse } from "@breng/types/planner"
import { GenericSearchResult } from "@breng/types/search"
import Box from "@mui/joy/Box"
import Card from "@mui/joy/Card"
import SvgIcon from "@mui/joy/SvgIcon"
import Tab from "@mui/joy/Tab"
import TabList from "@mui/joy/TabList"
import TabPanel from "@mui/joy/TabPanel"
import Tabs from "@mui/joy/Tabs"
import Typography from "@mui/joy/Typography"
import { plannerBodySchema } from "@schemas/plannerBodySchema"

import styles from "./TravelPlan.module.scss"

import ky from "ky"
import { DateTime, Duration } from "luxon"
import { FC, useCallback, useEffect, useState } from "react"
import { MdArrowForward, MdSchedule } from "react-icons/md"
import { z } from "zod"

import { searchToPlannerLocation } from "@utils/searchToPlannerLocation"

export const TravelPlan: FC<{
	from: GenericSearchResult
	to: GenericSearchResult
}> = ({ from, to }) => {
	const [travelPlan, updateTravelPlan] = useState<PlannerResponse | false>(
		false,
	)

	const formatTime = useCallback(
		(ms: number | undefined): string =>
			ms
				? DateTime.fromMillis(ms).toLocaleString(
						DateTime.TIME_24_SIMPLE,
				  )
				: "~~:~~",
		[],
	)

	useEffect(() => {
		const controller = new AbortController()

		const data: z.input<typeof plannerBodySchema> = {
			from: searchToPlannerLocation(from),
			to: searchToPlannerLocation(to),
			date: DateTime.now().toMillis(),
		}

		ky.post("/api/planner", {
			json: data,
			signal: controller.signal,
		})
			.json<PlannerResponse>()
			.then((data) => {
				updateTravelPlan(data)
			})

		return () => {
			console.log("Aborting Request")

			controller.abort()
		}
	}, [from, to])

	if (travelPlan == false) {
		return <>Loading...</>
	}
	const { itineraries } = travelPlan.result.result.plan

	return (
		<>
			<Tabs
				className={styles.wrapper}
				orientation="vertical"
				defaultValue={0}
			>
				<TabList className={styles.half} variant="soft">
					{itineraries.map((itinerary) => (
						<Tab
							className={styles.itinerary}
							key={JSON.stringify(itinerary)}
						>
							<Box>
								<div className={styles.topText}>
									<Typography
										level="h2"
										fontSize="md"
										sx={{
											display: "flex",
											alignItems: "center",
										}}
									>
										{formatTime(itinerary.startTime)}
										<SvgIcon component={MdArrowForward} />
										{formatTime(itinerary.endTime)}
									</Typography>

									<Typography
										startDecorator={
											<SvgIcon component={MdSchedule} />
										}
									>
										{Duration.fromMillis(
											itinerary.duration * 1000,
										).toFormat("h:mm")}
									</Typography>
								</div>
								<Typography level="body2">
									{itinerary.legs.map((leg) => (
										<>{leg.mode} + </>
									))}
								</Typography>
							</Box>
						</Tab>
					))}
				</TabList>
				{itineraries.map((itinerary, i) => (
					<TabPanel
						className={styles.half}
						value={i}
						key={JSON.stringify(itinerary)}
					>
						<Card variant="soft">
							{itinerary.legs.map((leg) => (
								<div key={JSON.stringify(leg)}>
									<Typography
										level="h2"
										fontSize="md"
										sx={{
											display: "flex",
											alignItems: "center",
										}}
									>
										{formatTime(leg.from.arrival)}
										<SvgIcon component={MdArrowForward} />
										{formatTime(leg.from.departure)}
									</Typography>

									<Typography
										level="body1"
										sx={{
											display: "flex",
											alignItems: "center",
										}}
									>
										<> </>
										{leg.mode}
										<> </>

										{leg.from.name}
										<> </>
										<SvgIcon component={MdArrowForward} />
										<> </>
										{leg.to.name}
									</Typography>
								</div>
							))}
						</Card>
					</TabPanel>
				))}
			</Tabs>
		</>
	)
}
