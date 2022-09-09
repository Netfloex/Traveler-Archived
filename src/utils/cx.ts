export const cx = (...input: Array<string | boolean | undefined>): string => {
	return input.filter(Boolean).join(" ")
}
