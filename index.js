'use strict'

const create = require('synchronous-autocomplete')
const tokenize = require('tokenize-db-station-name')

const tokens = require('./tokens.json')
const scores = require('./scores.json')
const weights = require('./weights.json')
const nrOfTokens = require('./nr-of-tokens.json')
const originalIds = require('./original-ids.json')

module.exports = create(tokens, scores, weights, nrOfTokens, originalIds, tokenize)
