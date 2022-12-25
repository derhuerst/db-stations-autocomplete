import {dirname, join as pathJoin} from 'node:path'
import {fileURLToPath} from 'node:url'
import {writeFile} from 'node:fs/promises'
import readStations from 'db-stations'
import build from 'synchronous-autocomplete/build.js'
import tokenize from 'tokenize-db-station-name'

const __dirname = dirname(fileURLToPath(import.meta.url))

const writeJSON = async (file, data) => {
	await writeFile(pathJoin(__dirname, file), JSON.stringify(data))
}

console.info('Collecting search items.')

const items = []
for await (const station of readStations()) {
	items.push({
		id: station.id,
		name: station.name,
		weight: station.weight
	})
}

console.info('Computing a search index.')

const {tokens, scores, weights, nrOfTokens, originalIds} = build(tokenize, items)

console.info('Writing the index to disk.')

await writeJSON('tokens.json', tokens)
await writeJSON('scores.json', scores)
await writeJSON('weights.json', weights)
await writeJSON('nr-of-tokens.json', nrOfTokens)
await writeJSON('original-ids.json', originalIds)
