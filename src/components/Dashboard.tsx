import Box from "@mui/joy/Box"
import Card from "@mui/joy/Card"
import Sheet from "@mui/joy/Sheet"
import Typography from "@mui/joy/Typography"

import type { FC } from "react"
import { LocationTextField } from "src/components/LocationTextField"

export const Dashboard: FC = () => (
	<>
		<Sheet variant="outlined">
			<Card variant="outlined">
				<Typography level="h3">Plan your trip</Typography>
				<Box
					sx={{
						display: "flex",
					}}
				>
					<LocationTextField label="From" autoFocus />
					<LocationTextField label="To" />
				</Box>
			</Card>
		</Sheet>
	</>
)
