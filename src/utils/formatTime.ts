import { DateTime } from "luxon"

export const formatTime = (ms: number | undefined): string =>
	ms
		? DateTime.fromMillis(ms).toLocaleString(DateTime.TIME_24_SIMPLE)
		: "~~:~~"
