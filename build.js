'use strict'

const fs = require('fs')
const path = require('path')
const getStations = require('db-stations')
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

// we map the IDs to get smaller file sizes
const originalIds = Object.create(null)
let currentId = 0

const items = []

getStations()
.on('data', (station) => {
	const newId = (currentId++).toString(36)
	originalIds[newId] = station.id

	items.push({
		id: newId,
		name: station.name,
		weight: station.weight
	})
})
.once('end', () => {
	console.info('Computing a search index.')

	const {tokens, scores, weights, nrOfTokens} = build(tokenize, items)

	console.info('Writing the index to disk.')

	writeJSON('original-ids.json', originalIds, showError)
	writeJSON('tokens.json', tokens, showError)
	writeJSON('scores.json', scores, showError)
	writeJSON('weights.json', weights, showError)
	writeJSON('nr-of-tokens.json', nrOfTokens, showError)
})
.once('error', showError)
