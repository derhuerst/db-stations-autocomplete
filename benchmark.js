'use strict'

const {Suite} = require('benchmark')

const autocomplete = require('.')

new Suite()

.add('basic query, one token', function () {
	autocomplete('Leipzig', 3)
})
.add('basic query, two tokens', function () {
	autocomplete('Dortmund Süd', 3)
})
.add('no completion – "Münc Hbf"', function () {
	autocomplete('Münc Hbf', 3, false, false)
})
.add('completion – "Münc Hbf"', function () {
	autocomplete('Münc Hbf', 3, false, true)
})
.add('completion – "charlo"', function () {
	autocomplete('charlo', 3, false)
})
.add('complex', function () {
	autocomplete('Calbe Saale Ost', 3)
})
.add('non-fuzzy – "berlin charlottenburg"', function () {
	autocomplete('berlin charlottenburg', 3, false)
})
.add('fuzzy – "berlin charlottenbrug" (typo)', function () {
	autocomplete('berlin charlottenbrug', 3, true)
})
.add('100 results – "Münc"', function () {
	autocomplete('Münc', 100)
})

.on('cycle', (e) => {
	console.log(e.target.toString())
})
.run()
