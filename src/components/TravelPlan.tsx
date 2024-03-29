import { GenericSearchResult } from "@breng/types/search"
import Box from "@mui/joy/Box"
import Card from "@mui/joy/Card"
import CircularProgress from "@mui/joy/CircularProgress"
import SvgIcon from "@mui/joy/SvgIcon"
import Tab from "@mui/joy/Tab"
import TabList from "@mui/joy/TabList"
import TabPanel from "@mui/joy/TabPanel"
import Tabs from "@mui/joy/Tabs"
import Typography from "@mui/joy/Typography"
import { plannerBodySchema } from "@schemas/plannerBodySchema"

import styles from "./TravelPlan.module.scss"

import { DateTime, Duration } from "luxon"
import { FC, useMemo } from "react"
import {
	MdArrowForward,
	MdChevronRight,
	MdExploreOff,
	MdSchedule,
} from "react-icons/md"
import { ModeTypeToIcon } from "src/components/ModeTypeToIcon"
import { z } from "zod"

import { formatTime } from "@utils/formatTime"
import { searchToPlannerLocation } from "@utils/searchToPlannerLocation"
import { trpc } from "@utils/trpc"

export const TravelPlan: FC<{
	from: GenericSearchResult
	to: GenericSearchResult
}> = ({ from, to }) => {
	const plannerBody = useMemo<z.input<typeof plannerBodySchema>>(
		() => ({
			from: searchToPlannerLocation(from),
			to: searchToPlannerLocation(to),
			date: DateTime.now().toMillis(),
		}),
		[from, to],
	)

	const plannerQuery = trpc.planner.useQuery(plannerBody)

	if (plannerQuery.isLoading) {
		return (
			<div className={styles.loadingWrapper}>
				<CircularProgress />
			</div>
		)
	}

	if (plannerQuery.error) {
		return <>Error</>
	}

	const { itineraries } = plannerQuery.data.result.result.plan

	if (!itineraries.length) {
		return (
			<Typography startDecorator={<SvgIcon component={MdExploreOff} />}>
				No travel advice found.
			</Typography>
		)
	}

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
									{itinerary.legs.map(
										(leg, i, { length }) => (
											<>
												<Typography
													startDecorator={
														<ModeTypeToIcon
															key={JSON.stringify(
																leg,
															)}
															type={leg.mode}
														/>
													}
													endDecorator={
														i + 1 !== length ? (
															<SvgIcon
																component={
																	MdChevronRight
																}
															/>
														) : undefined
													}
												>
													{leg.routeShortName ??
														Duration.fromMillis(
															leg.duration * 1000,
														)
															.as("minutes")
															.toFixed(0) +
															" min"}
												</Typography>
											</>
										),
									)}
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
						sx={{ padding: 0 }}
					>
						<Card variant="soft" sx={{ "--Card-padding": "1rem" }}>
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
										<ModeTypeToIcon type={leg.mode} />
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
