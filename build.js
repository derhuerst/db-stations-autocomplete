'use strict'

const fs = require('fs')
const path = require('path')
const getStations = require('db-hafas-stations')
const build = require('synchronous-autocomplete/build')
const tokenize = require('tokenize-db-station-name')

const showError = (err) => {
	if (!err) return
	console.error(err.stack)
	process.exit(1)
}

const writeJSON = (file, data, cb) => {
	fs.writeFile(path.join(__dirname, file), JSON.stringify(data), cb)
}

console.info('Collecting search items.')

const items = []
getStations()
.on('data', (station) => {
	items.push({
		id: station.id,
		name: station.name,
		weight: station.weight || 1
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
