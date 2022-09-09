import ClearIcon from "@mui/icons-material/Clear"
import TrainIcon from "@mui/icons-material/Train"
import Box from "@mui/joy/Box"
import List from "@mui/joy/List"
import ListItemButton from "@mui/joy/ListItemButton"
import TextField from "@mui/joy/TextField"

import styles from "./LocationTextField.module.scss"

import type { FC } from "react"
import { useState } from "react"

import { cx } from "@utils/cx"

export const LocationTextField: FC<{ label: string; autoFocus?: boolean }> = ({
	label,
	autoFocus,
}) => {
	const [value, setValue] = useState("")
	const [focused, setFocused] = useState(autoFocus ?? false)

	return (
		<Box
			className={cx(
				styles.wrapper,
				!value.length && styles.inputEmpty,
				focused && styles.focused,
			)}
		>
			<TextField
				label={label}
				placeholder="Address, station"
				startDecorator={<TrainIcon />}
				className={styles.input}
				autoFocus={autoFocus}
				onBlur={(): void => setFocused(false)}
				onFocus={(): void => setFocused(true)}
				endDecorator={
					<span
						className={cx(styles.clearButtonWrapper)}
						onClick={(): void => {
							setValue("")
						}}
					>
						<ClearIcon />
					</span>
				}
				value={value}
				onChange={(e): void => {
					setValue(e.target.value)
				}}
			/>
			<List className={styles.list}>
				{value.split("").map((e, i) => (
					<ListItemButton variant="solid" key={e + i}>
						{value}
					</ListItemButton>
				))}
			</List>
		</Box>
	)
}
