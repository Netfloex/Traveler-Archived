import {
	GeneralSearchResult,
	SearchResponse,
	TransitSearchResult,
} from "@breng/types/search"
import { GenericSearchResult } from "@breng/types/search"
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
	Dispatch,
	FC,
	FormEventHandler,
	MouseEventHandler,
	MutableRefObject,
	SetStateAction,
	useCallback,
	useMemo,
	useRef,
	useState,
} from "react"
import { MdClear, MdSearch } from "react-icons/md"

import { TypeToIcon } from "@components"

import { cx } from "@utils/cx"

export const LocationTextField: FC<{
	label: string
	autoFocus?: boolean
	selected: false | GenericSearchResult
	setSelected: Dispatch<SetStateAction<false | GenericSearchResult>>
	cache: MutableRefObject<
		Map<string, Array<TransitSearchResult | GeneralSearchResult>>
	>
}> = ({ label, autoFocus, selected, setSelected, cache }) => {
	const [query, setQuery] = useState("")
	const [focused, setFocused] = useState(autoFocus ?? false)
	const [autoCompleteList, setAutoComplete] = useState<
		Array<TransitSearchResult | GeneralSearchResult>
	>([])

	const inputRef = useRef<HTMLDivElement>(null)
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
		[cache],
	)

	const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
		(e) => {
			const value = e.target.value
			setQuery(value)

			const cacheQuery = value.toLowerCase()
			if (cache.current.has(cacheQuery)) {
				return setAutoComplete(cache.current.get(cacheQuery)!)
			}
			setSelected(false)

			updateAutoComplete(value)
		},
		[updateAutoComplete, cache, setSelected],
	)

	const onClear = useCallback<
		MouseEventHandler<HTMLSpanElement>
	>((): void => {
		setQuery("")
		inputRef.current?.querySelector("input")?.focus()
		setSelected(false)
	}, [setSelected])

	const onSelect = useCallback<(place: GenericSearchResult) => () => void>(
		(place) => () => {
			setQuery(place.name)
			setAutoComplete([])
			setSelected(place)
		},
		[setSelected],
	)

	const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
		(e) => {
			e.preventDefault()
			if (autoCompleteList[0]) {
				onSelect(autoCompleteList[0])()
			}
		},
		[autoCompleteList, onSelect],
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
			<form onSubmit={onSubmit}>
				<TextField
					variant="soft"
					label={label}
					placeholder="Address, station"
					startDecorator={
						selected ? (
							<TypeToIcon type={selected.type} />
						) : (
							<SvgIcon component={MdSearch} />
						)
					}
					className={styles.input}
					autoFocus={autoFocus}
					onBlur={(): void => setFocused(false)}
					onFocus={(): void => setFocused(true)}
					ref={inputRef}
					endDecorator={
						<span
							className={styles.clearButtonWrapper}
							onClick={onClear}
						>
							<SvgIcon component={MdClear} />
						</span>
					}
					value={query}
					onChange={onChange}
				/>
			</form>
			<Card
				className={styles.list}
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
								onClick={onSelect(place)}
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
