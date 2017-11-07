'use strict'

const fs = require('fs')
const path = require('path')
const stations = require('db-stations')
const tokenize = require('tokenize-db-station-name')

const showError = (err) => {
	if (!err) return
	console.error(err.stack)
	process.exit(1)
}

const writeJSON = (file, data, cb) => {
	fs.writeFile(path.join(__dirname, file), JSON.stringify(data), cb)
}

const defaultWeight = 10 // todo: use the average weight instead



const createIndex = (cb) => {
	const index = Object.create(null)

	stations()
	.on('data', (s) => {
		const tokens = tokenize(s.name)
		index[s.id] = {
			n: s.name,
			w: s.weight || defaultWeight,
			t: tokens.length
		}
	})
	.once('end', () => cb(null, index))
	.once('error', cb)
}

const createTokensList = (cb) => {
	const allTokens = Object.create(null)

	stations()
	.on('data', (s) => {
		const tokens = tokenize(s.name)
		for (let t of tokens) {
			if (!(t in allTokens)) allTokens[t] = []
			allTokens[t].push(s.id)
		}
	})
	.once('end', () => cb(null, allTokens))
	.once('error', cb)
}

const computeTokenScores = (tokensList) => {
	const scores = Object.create(null)
	const nrOfAllStations = Object.keys(tokensList).length

	for (let t in tokensList) {
		const nrOfStations = tokensList[t].length
		scores[t] = nrOfStations / nrOfAllStations
	}

	let max = 0
	for (let t in scores) max = Math.max(scores[t], max)

	for (let t in scores) {
		let score = (max - scores[t]) / max // revert, clamp to [0, 1]
		score = Math.pow(score, 5) // stretch distribution
		scores[t] = parseFloat(score.toFixed(5))
	}

	return scores
}



createIndex((err, index) => {
	if (err) return showError(err)

	writeJSON('stations.json', index, showError)
})

createTokensList((err, tokensList) => {
	if (err) return showError(err)

	writeJSON('tokens.json', tokensList, showError)
	writeJSON('scores.json', computeTokenScores(tokensList), showError)
})
