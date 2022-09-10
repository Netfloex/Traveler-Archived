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

import throttle from "lodash.throttle"
import {
	ChangeEventHandler,
	FC,
	useCallback,
	useMemo,
	useRef,
	useState,
} from "react"

import { TypeToIcon } from "@components"

import { cx } from "@utils/cx"

export const LocationTextField: FC<{ label: string; autoFocus?: boolean }> = ({
	label,
	autoFocus,
}) => {
	const [query, setQuery] = useState("")
	const [focused, setFocused] = useState(autoFocus ?? false)
	const [autoCompleteList, setAutoComplete] = useState<
		Array<TransitSearchResult | GeneralSearchResult>
	>([])

	const cache = useRef(new Map())

	const updateAutoComplete = useMemo(
		() =>
			throttle((searchQuery: string) => {
				if (!searchQuery) return setAutoComplete([])

				fetch(`/api/search?q=${searchQuery}`)
					.then((res) => res.json())
					.then((data: SearchResponse) => {
						const autoCompleteList = [
							...(data.result.transit ?? []),
							...(data.result.general ?? []),
						]
						setAutoComplete(autoCompleteList)

						cache.current.set(
							searchQuery.toLowerCase(),
							autoCompleteList,
						)
					})
			}, 300),
		[],
	)

	const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
		(e) => {
			const value = e.target.value
			setQuery(value)

			const cacheQuery = value.toLowerCase()
			if (cache.current.has(cacheQuery)) {
				return setAutoComplete(cache.current.get(cacheQuery))
			}

			updateAutoComplete(value)
		},
		[updateAutoComplete],
	)

	return (
		<Box
			className={cx(
				styles.wrapper,
				!query.length && styles.inputEmpty,
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
						className={styles.clearButtonWrapper}
						onClick={(): void => {
							setQuery("")
						}}
					>
						<ClearIcon />
					</span>
				}
				value={query}
				onChange={onChange}
			/>
			<List className={styles.list}>
				{autoCompleteList?.map((e, i) => (
					<ListItemButton
						variant="solid"
						key={e.name + ("stopid" in e ? e.stopid : "") + i}
						onClick={(): void => {
							setQuery(e.name)
							setAutoComplete([])
						}}
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
