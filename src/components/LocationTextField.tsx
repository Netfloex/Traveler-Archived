import {
	GeneralSearchResult,
	SearchResponse,
	TransitSearchResult,
} from "@breng/types/search"
import ClearIcon from "@mui/icons-material/Clear"
import TrainIcon from "@mui/icons-material/Train"
import Box from "@mui/joy/Box"
import List from "@mui/joy/List"
import ListItemButton from "@mui/joy/ListItemButton"
import ListItemDecorator from "@mui/joy/ListItemDecorator"
import TextField from "@mui/joy/TextField"
import Typography from "@mui/joy/Typography"

import styles from "./LocationTextField.module.scss"

import { FC, useEffect, useState } from "react"
import { TypeToIcon } from "src/components/TypeToIcon"

import { cx } from "@utils/cx"

export const LocationTextField: FC<{ label: string; autoFocus?: boolean }> = ({
	label,
	autoFocus,
}) => {
	const [value, setValue] = useState("")
	const [focused, setFocused] = useState(autoFocus ?? false)
	const [autoCompleteList, setAutoComplete] = useState<
		Array<TransitSearchResult | GeneralSearchResult>
	>([])

	useEffect(() => {
		if (!value) return setAutoComplete([])

		fetch(`/api/search?q=${value}`)
			.then((res) => res.json())
			.then((data: SearchResponse) => {
				setAutoComplete([
					...(data.result.transit ?? []),
					...(data.result.general ?? []),
				])
			})
	}, [value])

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
				{autoCompleteList?.map((e, i) => (
					<ListItemButton
						variant="solid"
						key={e.name + ("stopid" in e ? e.stopid : "") + i}
					>
						<ListItemDecorator>
							<TypeToIcon type={e.type} />
						</ListItemDecorator>
						<div>
							{e.name}

							<Typography fontSize="xs">{e.city}</Typography>
						</div>
					</ListItemButton>
				))}
			</List>
		</Box>
	)
}
