import readStations from 'db-stations'
import prompt from 'cli-autocomplete'

import {autocomplete} from './index.js'

const pStations = new Promise((resolve, reject) => {
	const res = Object.create(null)
	readStations()
	.on('data', (s) => {
		res[s.id] = s
	})
	.once('end', () => {
		resolve(res)
	})
	.once('error', reject)
})

const suggest = (input) => {
	return pStations
	.then((stationsById) => {
		const results = autocomplete(input, 5)
		const choices = []

		for (let result of results) {
			const station = stationsById[result.id]
			if (!station) continue

			choices.push({
				title: [
					station.name,
					'–',
					'score:', result.score.toFixed(3),
					'relevance:', result.relevance.toFixed(3)
				].join(' '),
				value: station.id
			})
		}

		return choices
	})
}

prompt('Type a station name!', suggest)
.once('abort', () => {
	process.exitCode = 1
})
.once('submit', id => console.log(id))
