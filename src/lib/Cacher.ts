import { outputJSON, pathExists, readJSON } from "fs-extra"
import { Got, OptionsOfJSONResponseBody } from "got"
import { join } from "path"

import { createHash } from "@utils/createHash"
import { http } from "@utils/http"

export class Cacher<T> {
	identifier: string
	got: Got

	private getCacheFileName(key: string): string {
		return join(process.cwd(), "cache", this.identifier, key + ".json")
	}

	constructor(identifier: string, got = http) {
		this.identifier = identifier
		this.got = got
	}

	private async has(key: string): Promise<boolean> {
		return await pathExists(this.getCacheFileName(key))
	}

	private async get(key: string): Promise<T> {
		return await readJSON(this.getCacheFileName(key), "utf-8")
	}

	private async set(key: string, value: T): Promise<T> {
		await outputJSON(this.getCacheFileName(key), value, {
			spaces: process.env.FORMAT_CACHE ? "\t" : undefined,
		})
		return value
	}

	async request(options: OptionsOfJSONResponseBody): Promise<T> {
		const slug = createHash(JSON.stringify(options))

		if (await this.has(slug)) {
			return await this.get(slug)
		}

		const response = await this.got<T>(options)

		return await this.set(slug, response.body)
	}
}
