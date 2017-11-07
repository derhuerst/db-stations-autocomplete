# db-stations-autocomplete

*db-stations-autocomplete* provides a **stations search for [Deutsche Bahn](https://en.wikipedia.org/wiki/Deutsche_Bahn)**. It pulls its data from [`db-stations`](https://github.com/derhuerst/db-stations).

[![npm version](https://img.shields.io/npm/v/db-stations-autocomplete.svg)](https://www.npmjs.com/package/db-stations-autocomplete)
[![build status](https://img.shields.io/travis/derhuerst/db-stations-autocomplete.svg)](https://travis-ci.org/derhuerst/db-stations-autocomplete)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/db-stations-autocomplete.svg)
[![chat on Gitter](https://badges.gitter.im/derhuerst/vbb-rest.svg)](https://gitter.im/derhuerst)


## Installing

```shell
npm install db-stations-autocomplete
```


## Usage

```js
autocomplete(query, limit = 6, fuzzy = false, completion = true)
```

```javascript
const autocomplete = require('db-stations-autocomplete')

autocomplete('burg')
```

This returns stations in the [*Friendly Public Transport Format*](https://github.com/public-transport/friendly-public-transport-format).

```javascript
[ {
	type: 'station',
	id: '8001156',
	name: 'Bremen-Burg',
	weight: 162.4,
	relevance: 1.891765,
	score: 10.321176253764524
}, {
	type: 'station',
	id: '8001289',
	name: 'Burgkunstadt',
	weight: 64.3,
	relevance: 2.2942733333333334,
	score: 9.191410194818323
}, {
	type: 'station',
	id: '8011297',
	name: 'Burgstädt',
	weight: 56.1,
	relevance: 2.36094,
	score: 9.038004862508393
}, {
	type: 'station',
	id: '8001297',
	name: 'Burgthann',
	weight: 36.5,
	relevance: 2.4053845,
	score: 7.979005900307141
}, {
	type: 'station',
	id: '8001285',
	name: 'Burgheim',
	weight: 25.6,
	relevance: 2.46094,
	score: 7.252944381011258
}, {
	type: 'station',
	id: '8011296',
	name: 'Burgkemnitz',
	weight: 26.5,
	relevance: 2.3245763636363637,
	score: 6.930412885835083
} ]
```

If you set `fuzzy` to `true`, words with a [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance) `<= 3` will be taken into account. This is a lot slower though:

test | performance
-----|------------
non-fuzzy – `berlin charlottenburg` | 661 ops/sec
fuzzy – `berlin charlottenbrug` (note the typo) | 128 ops/sec


Setting `completion` to `false` speeds things up:

test | performance
-----|------------
completion – `Münc Hbf` | 17117 ops/sec
no completion – `Münc Hbf` | 638 ops/sec


## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/db-stations-autocomplete/issues).
