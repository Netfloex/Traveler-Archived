import { GenericSearchResult } from "@breng/types/search"
import Alert from "@mui/joy/Alert"
import Box from "@mui/joy/Box"
import Card from "@mui/joy/Card"
import CardOverflow from "@mui/joy/CardOverflow"
import CircularProgress from "@mui/joy/CircularProgress"
import List from "@mui/joy/List"
import ListItemButton from "@mui/joy/ListItemButton"
import ListItemContent from "@mui/joy/ListItemContent"
import ListItemDecorator from "@mui/joy/ListItemDecorator"
import SvgIcon from "@mui/joy/SvgIcon"
import TextField from "@mui/joy/TextField"
import Typography from "@mui/joy/Typography"

import styles from "./LocationTextField.module.scss"

import {
	ChangeEventHandler,
	Dispatch,
	FC,
	FormEventHandler,
	MouseEventHandler,
	SetStateAction,
	useCallback,
	useRef,
	useState,
} from "react"
import { MdClear, MdSearch } from "react-icons/md"

import { TypeToIcon } from "@components"

import { cx } from "@utils/cx"
import { trpc } from "@utils/trpc"

export const LocationTextField: FC<{
	label: string
	autoFocus?: boolean
	selected: false | GenericSearchResult
	setSelected: Dispatch<SetStateAction<false | GenericSearchResult>>
}> = ({ label, autoFocus, selected, setSelected }) => {
	const [query, setQuery] = useState("")
	const [focused, setFocused] = useState(autoFocus ?? false)
	const [autoCompleteListShown, setAutoCompleteListShown] = useState(false)
	const inputRef = useRef<HTMLDivElement>(null)
	const searchQuery = trpc.search.useQuery(
		{ query: query.toLocaleLowerCase() },
		{
			enabled: !!query,
			cacheTime: 10e10,
			staleTime: 10e10,
		},
	)

	const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
		(e) => {
			const value = e.target.value
			setQuery(value)

			setSelected(false)
			setAutoCompleteListShown(true)
		},
		[setSelected],
	)

	const onClear = useCallback<
		MouseEventHandler<HTMLSpanElement>
	>((): void => {
		setQuery("")
		inputRef.current?.querySelector("input")?.focus()
		setAutoCompleteListShown(false)
		setSelected(false)
	}, [setSelected])

	const onSelect = useCallback<(place: GenericSearchResult) => () => void>(
		(place) => () => {
			setQuery(place.name)
			setAutoCompleteListShown(false)
			setSelected(place)
		},
		[setSelected],
	)

	const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
		(e) => {
			e.preventDefault()

			if (searchQuery.data?.[0]) {
				onSelect(searchQuery.data?.[0])()
				setAutoCompleteListShown(false)
			}
		},
		[onSelect, searchQuery.data],
	)

	return (
		<Box
			className={cx(
				styles.wrapper,
				!query.length && styles.inputEmpty,
				autoCompleteListShown && query && styles.autoCompleteListShown,
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
						{searchQuery.isLoading ? (
							<Card
								variant="soft"
								className={styles.loadingWrapper}
							>
								<CircularProgress
									variant="soft"
									color="neutral"
								/>
							</Card>
						) : searchQuery.isError ? (
							<Alert color="danger">
								Error: {searchQuery.error.message}
							</Alert>
						) : (
							searchQuery.data.map((place, i) => (
								<ListItemButton
									variant="soft"
									key={
										place.name +
										("stopid" in place
											? place.stopid
											: "") +
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
							))
						)}
					</List>
				</CardOverflow>
			</Card>
		</Box>
	)
}
