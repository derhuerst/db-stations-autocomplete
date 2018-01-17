'use strict'

const create = require('synchronous-autocomplete')
const tokenize = require('tokenize-db-station-name')

const originalIds = require('./original-ids.json')
const tokens = require('./tokens.json')
const scores = require('./scores.json')
const weights = require('./weights.json')
const nrOfTokens = require('./nr-of-tokens.json')

const _autocomplete = create(tokens, scores, weights, nrOfTokens, tokenize)

const autocomplete = (query, limit = 6, fuzzy = false, completion = true) => {
	const results = _autocomplete(query, limit, fuzzy, completion)
	for (let res of results) {
		res.id = originalIds[res.id]
	}
	return results
}

module.exports = autocomplete
