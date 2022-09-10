import {
	GeneralSearchResult,
	SearchResponse,
	TransitSearchResult,
} from "@breng/types/search"
import Box from "@mui/joy/Box"
import Card from "@mui/joy/Card"
import CardOverflow from "@mui/joy/CardOverflow"
import List from "@mui/joy/List"
import ListItemButton from "@mui/joy/ListItemButton"
import ListItemContent from "@mui/joy/ListItemContent"
import ListItemDecorator from "@mui/joy/ListItemDecorator"
import SvgIcon from "@mui/joy/SvgIcon"
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
import { MdClear, MdTrain } from "react-icons/md"

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
							...(data.result?.transit ?? []),
							...(data.result?.general ?? []),
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
				// eslint-disable-next-line css-modules/no-undef-class
				!autoCompleteList.length && styles.autoCompleteEmpty,
				focused && styles.focused,
			)}
		>
			<TextField
				variant="soft"
				label={label}
				placeholder="Address, station"
				startDecorator={<SvgIcon component={MdTrain}></SvgIcon>}
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
						<SvgIcon component={MdClear}></SvgIcon>
					</span>
				}
				value={query}
				onChange={onChange}
			/>
			<Card
				className={styles.list}
				// sx={{ padding: 0, "& ul": { padding: 0 } }}
				sx={{
					"--Card-padding": 0,
					"--List-item-paddingY": 0,
					overflow: "hidden",
					borderTopLeftRadius: 0,
					borderTopRightRadius: 0,
				}}
			>
				<CardOverflow>
					<List
						sx={{
							"--List-divider-gap": 0,
						}}
					>
						{autoCompleteList?.map((place, i) => (
							<ListItemButton
								variant="soft"
								key={
									place.name +
									("stopid" in place ? place.stopid : "") +
									i
								}
								onClick={(): void => {
									setQuery(place.name)
									setAutoComplete([])
								}}
							>
								<ListItemDecorator>
									<TypeToIcon type={place.type} />
								</ListItemDecorator>
								<ListItemContent>
									{place.name}
									<Typography fontSize="xs">
										{[
											place.city,
											"country" in place
												? place.country
												: false,
										]
											.filter(Boolean)
											.join(", ")}
									</Typography>
								</ListItemContent>
							</ListItemButton>
						))}
					</List>
				</CardOverflow>
			</Card>
		</Box>
	)
}
