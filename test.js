'use strict'

const test = require('tape')
const sortBy = require('lodash/sortBy')

const autocomplete = require('.')

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
	const results = autocomplete('berli', 3)

	t.deepEqual(results, sortBy(results, 'score').reverse())
})

// todo: fails with tokenize-db-station-name@2
test.skip('autocomplete limits the number of results', (t) => {
	t.plan(1)
	t.equal(autocomplete('Hbf', 1).length, 1)
})

test('gives reasonable results', (t) => {
	const r0 = autocomplete('Münch', 3)
	const münchenHbf = r0.find(({id}) => id === '8000261')
	t.ok(münchenHbf, 'missing "München Hbf"')
	const münchenOst = r0.find(({id}) => id === '8000262')
	t.ok(münchenOst, 'missing "München Ost"')

	const r1 = autocomplete('Berlin', 1)[0]
	t.ok(r1)
	t.equal((r1 || {}).id, '8011102') // Berlin Gesundbrunnen

	const r3 = autocomplete('Karlsruhe', 1, true, false)[0]
	t.ok(r3)
	t.equal((r3 || {}).id, '8000191') // Karlsruhe

	const r4 = autocomplete('Wedding', 1)[0]
	t.ok(r4)
	t.equal((r4 || {}).id, '8089131') // Berlin Wedding

	t.end()
})
