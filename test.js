'use strict'

const mocked = require('sandboxed-module')
const test = require('tape')
const sortBy = require('lodash.sortby')

const autocomplete = mocked.require('.', {requires: {
	'./stations.json': {
		one: {
			n: 'Foo Station',
			w: 10,
			t: 2
		},
		two: {
			n: 'Bar Main Station',
			w: 20,
			t: 3
		}
	},
	'./tokens.json': {
		foo: ['one'],
		bar: ['two'],
		main: ['two'],
		station: ['one', 'two']
	},
	'./scores.json': {
		foo: 1,
		bar: 1,
		main: 1,
		station: .5
	}
}})

const autocomplete2 = require('.')



test('tokensByFragment finds an exact match', (t) => {
	t.plan(1)
	const results = autocomplete.tokensByFragment('main', false, false)

	t.deepEqual(results, {
		two: 1 + 1 + 2
	})
})

test('tokensByFragment finds a match by first letters', (t) => {
	t.plan(2)

	t.deepEqual(autocomplete.tokensByFragment('mai', true, false), {
		two: 1 + 1 + 3/4
	})

	t.deepEqual(autocomplete.tokensByFragment('mai', false, false), {})
})

test('tokensByFragment finds a match despite typos', (t) => {
	t.plan(1)
	const results = autocomplete.tokensByFragment('statoi', false, true) // typo

	t.deepEqual(results, {
		one: (1 + .5) / (1 + 2),
		two: (1 + .5) / (1 + 2)
	})
})



test('autocomplete returns an array', (t) => {
	t.plan(2)
	t.ok(Array.isArray(autocomplete('', 3)))
	t.ok(Array.isArray(autocomplete('foo', 3)))
})

test('autocomplete returns an empty array for an empty query', (t) => {
	t.plan(1)
	const results = autocomplete('', 3)

	t.equal(results.length, 0)
})

test('autocomplete sorts by score', (t) => {
	t.plan(1)
	const results = autocomplete('statio', 3)

	t.deepEqual(results, sortBy(results, 'score').reverse())
})

test('autocomplete calculates the relevance & score correctly', (t) => {
	t.plan(7)
	const results = autocomplete('statio', 3)

	t.equal(results.length, 2)
	t.equal(results[0].id, 'one')
	const r0 = (1 + .5 + 6/7) / 2 // 6 of 7 letters matched, 2 tokens
	t.equal(results[0].relevance.toFixed(10), r0.toFixed(10))
	const s0 = (1 + .5 + 6/7) / 2 * Math.pow(10, 1/3)
	t.equal(results[0].score.toFixed(10), s0.toFixed(10))

	t.equal(results[1].id, 'two')
	const r1 = (1 + .5 + 6/7) / 3 // 6 of 7 letters matched, 3 tokens
	t.equal(results[1].relevance.toFixed(10), r1.toFixed(10))
	const s1 = (1 + .5 + 6/7) / 3 * Math.pow(20, 1/3)
	t.equal(results[1].score.toFixed(10), s1.toFixed(10))
})

test('autocomplete limits the number of results', (t) => {
	t.plan(1)
	t.equal(autocomplete('statio', 1).length, 1)
})

test('gives reasonable results', (t) => {
	t.plan(3)

	t.equal((autocomplete2('Leipzig Hbf', 1)[0] || {}).id, '8010205')
	t.equal((autocomplete2('Jena West', 1)[0] || {}).id, '8011957')

	t.ok(autocomplete2('berg am', 100).every((s) => s.type === 'station'))
})
