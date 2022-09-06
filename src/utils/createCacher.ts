import filenamify from "filenamify"
import { outputJSON, pathExists, readJSON } from "fs-extra"
import { join } from "path"

interface Cacher<T> {
	has: (key: string) => Promise<boolean>
	get: (key: string) => Promise<T>
	set: (key: string, value: T) => Promise<void>
}

export const createCacher = <T>(identifier: string): Cacher<T> => {
	const getCacheFileName = (key: string): string =>
		join(process.cwd(), "cache", identifier, filenamify(key))

	return {
		has: async (key: string): Promise<boolean> => {
			return await pathExists(getCacheFileName(key))
		},

		get: async (key: string): Promise<T> => {
			return await readJSON(getCacheFileName(key), "utf-8")
		},
		set: async (key: string, value: T): Promise<void> => {
			await outputJSON(getCacheFileName(key), value)
		},
	}
}
