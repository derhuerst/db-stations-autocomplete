import {dirname, join as pathJoin} from 'node:path'
import {fileURLToPath} from 'node:url'
import {writeFile} from 'node:fs'
import readStations from 'db-stations'
import build from 'synchronous-autocomplete/build.js'
import tokenize from 'tokenize-db-station-name'

const __dirname = dirname(fileURLToPath(import.meta.url))

const showError = (err) => {
	if (!err) return
	console.error(err.stack)
	process.exit(1)
}

const writeJSON = (file, data, cb) => {
	writeFile(pathJoin(__dirname, file), JSON.stringify(data), cb)
}

console.info('Collecting search items.')

const items = []
readStations()
.on('data', (station) => {
	items.push({
		id: station.id,
		name: station.name,
		weight: station.weight
	})
})
.once('end', () => {
	console.info('Computing a search index.')

	const {tokens, scores, weights, nrOfTokens, originalIds} = build(tokenize, items)

	console.info('Writing the index to disk.')

	writeJSON('tokens.json', tokens, showError)
	writeJSON('scores.json', scores, showError)
	writeJSON('weights.json', weights, showError)
	writeJSON('nr-of-tokens.json', nrOfTokens, showError)
	writeJSON('original-ids.json', originalIds, showError)
})
.once('error', showError)
