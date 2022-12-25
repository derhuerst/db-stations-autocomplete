// todo: use import assertions once they're supported by Node.js & ESLint
// https://github.com/tc39/proposal-import-assertions
import {createRequire} from 'module'
const require = createRequire(import.meta.url)

import {createAutocomplete} from 'synchronous-autocomplete'
import tokenize from 'tokenize-db-station-name'

const tokens = require('./tokens.json')
const scores = require('./scores.json')
const weights = require('./weights.json')
const nrOfTokens = require('./nr-of-tokens.json')
const originalIds = require('./original-ids.json')

const index = {
	tokens,
	scores,
	weights,
	nrOfTokens,
	originalIds,
}
const autocomplete = createAutocomplete(index, tokenize)

export {
	index,
	autocomplete,
}
