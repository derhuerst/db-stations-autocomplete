import {readStations} from 'db-stations'
import prompt from 'cli-autocomplete'

import {autocomplete} from './index.js'

const stationsById = Object.create(null)

for await (const s of readStations()) {
	stationsById[s.id] = s
}

const suggest = async (input) => {
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
				'relevance:', result.relevance.toFixed(3),
				'weight:', result.weight.toFixed(3),
			].join(' '),
			value: station.id
		})
	}

	return choices
}

prompt('Type a station name!', suggest)
.once('submit', (id) => {
	console.log(id, stationsById[id]?.name)
})
.once('abort', () => {
	process.exit(1)
})
