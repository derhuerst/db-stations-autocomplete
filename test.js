'use strict'

const test = require('tape')
const sortBy = require('lodash.sortby')

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

test('autocomplete limits the number of results', (t) => {
	t.plan(1)
	t.equal(autocomplete('Hbf', 1).length, 1)
})

test('gives reasonable results', (t) => {
	const r0 = autocomplete('Münch', 1)[0]
	t.ok(r0)
	t.equal((r0 || {}).id, '8000261') // München Hbf

	const r1 = autocomplete('Berlin', 1)[0]
	t.ok(r1)
	t.equal((r1 || {}).id, '8011160') // Berlin Hauptbahnhof

	const r3 = autocomplete('Karlsruhe', 1, true, false)[0]
	t.ok(r3)
	t.equal((r3 || {}).id, '8000191') // Karlsruhe

	const r4 = autocomplete('Wedding', 1)[0]
	t.ok(r4)
	t.equal((r4 || {}).id, '8089131') // Berlin Wedding

	t.end()
})
