'use strict'

const hifo = require('hifo')
const tokenize = require('tokenize-db-station-name')
const maxBy = require('lodash.maxby')
const leven = require('leven')

const stations = require('./stations.json')
const tokens = require('./tokens.json')
const scores = require('./scores.json')



const tokensByFragment = (fragment, completion, fuzzy) => {
	const results = {}
	const l = fragment.length

	if (tokens[fragment]) {
		const relevance = 1 + scores[fragment] + Math.sqrt(fragment.length)

		for (let id of tokens[fragment]) {
			if (!results[id] || !results[id] > relevance) {
				results[id] = relevance
			}
		}
	}

	if (completion || fuzzy) {
		for (let t in tokens) {
			if (fragment === t) continue // has been dealt with above

			let relevance
			let distance

			// add-one smoothing
			if (completion && t.length > fragment.length && fragment === t.slice(0, l)) {
				relevance = 1 + scores[t] + fragment.length / t.length
			} else if (fuzzy && (distance = leven(fragment, t)) <= 3) {
				relevance = (1 + scores[t]) / (distance + 1)
			} else continue

			for (let id of tokens[t]) {
				if (!results[id] || !results[id] > relevance) {
					results[id] = relevance
				}
			}
		}
	}

	return results
}

const autocomplete = (query, limit = 6, fuzzy = false, completion = true) => {
	if (query === '') return []
	const relevant = hifo(hifo.highest('score'), limit || 6)

	const data = {}
	for (let fragment of tokenize(query)) {
		data[fragment] = tokensByFragment(fragment, completion, fuzzy)
	}

	const totalRelevance = (id) => {
		let r = 1 / stations[id].t
		for (let fragment in data) {
			if (!data[fragment][id]) return false
			r *= data[fragment][id]
		}
		return r
	}

	const results = Object.create(null)
	for (let fragment in data) {
		for (let id in data[fragment]) {
			if (id in results) continue

			const relevance = totalRelevance(id)
			if (relevance === false) continue

			const station = stations[id]
			const score = relevance * Math.pow(station.w, 1/3)

			results[id] = {id, relevance, score}
		}
	}

	for (let id in results) relevant.add(results[id])
	return relevant.data.map((r) => {
		const s = stations[r.id]
		return {
			type: 'station',
			id: r.id,
			name: s.n,
			weight: s.w,
			relevance: r.relevance,
			score: r.score
		}
	})
}

module.exports = Object.assign(autocomplete, {tokensByFragment})
