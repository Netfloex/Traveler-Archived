import ClearIcon from "@mui/icons-material/Clear"
import TrainIcon from "@mui/icons-material/Train"
import Box from "@mui/joy/Box"
import Card from "@mui/joy/Card"
import Sheet from "@mui/joy/Sheet"
import TextField from "@mui/joy/TextField"
import Typography from "@mui/joy/Typography"

import type { FC } from "react"

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
					<TextField
						label="From"
						placeholder="Address, station"
						startDecorator={<TrainIcon fontSize="small" />}
						endDecorator={<ClearIcon />}
					/>
					<TextField
						label="To"
						placeholder="Address, station"
						startDecorator={<TrainIcon fontSize="small" />}
						endDecorator={<ClearIcon />}
					/>
				</Box>
			</Card>
		</Sheet>
	</>
)
