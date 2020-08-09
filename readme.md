# db-stations-autocomplete

*db-stations-autocomplete* provides a **stations search for [Deutsche Bahn](https://en.wikipedia.org/wiki/Deutsche_Bahn)**. Pulls its data from [`db-stations@4`](https://github.com/derhuerst/db-stations) (There's also [`db-hafas-stations-autocomplete`](https://github.com/derhuerst/db-hafas-stations-autocomplete), which pulls its data from [`db-hafas-stations`](https://github.com/derhuerst/db-hafas-stations)).

[![npm version](https://img.shields.io/npm/v/db-stations-autocomplete.svg)](https://www.npmjs.com/package/db-stations-autocomplete)
[![build status](https://api.travis-ci.org/derhuerst/db-stations-autocomplete.svg?branch=master)](https://travis-ci.org/derhuerst/db-stations-autocomplete)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/db-stations-autocomplete.svg)
![minimum Node.js version](https://img.shields.io/node/v/db-stations-autocomplete.svg)
[![chat with me on Gitter](https://img.shields.io/badge/chat%20with%20me-on%20gitter-512e92.svg)](https://gitter.im/derhuerst)
[![support me via GitHub Sponsors](https://img.shields.io/badge/support%20me-donate-fa7664.svg)](https://github.com/sponsors/derhuerst)


## Installing

```shell
npm install db-stations-autocomplete
```


## Usage

```js
autocomplete(query, results = 3, fuzzy = false, completion = true)
```

```javascript
const autocomplete = require('vbb-stations-autocomplete')
autocomplete('Münch', 3)
```

This returns stations in a reduced form of the [*Friendly Public Transport Format*](https://github.com/public-transport/friendly-public-transport-format). To get all details, pass use [`db-stations`](https://github.com/derhuerst/db-stations).

```javascript
[ {
	id: '8000261', // München Hbf
	relevance: 0.8794466403162056,
	score: 11.763480191996974,
	weight: 2393.2
}, {
	id: '8004128', // München Donnersbergerbrücke
	relevance: 0.8794466403162056,
	score: 9.235186720706798,
	weight: 1158
}, {
	id: '8004132', // München Karlsplatz
	relevance: 0.8794466403162056,
	score: 9.144716179768407,
	weight: 1124.3
} ]
```

If you set `fuzzy` to `true`, words with a [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance) `<= 3` will be taken into account. This is a lot slower though:

test | performance
-----|------------
non-fuzzy – `berlin charlottenburg` | 626 ops/sec
fuzzy – `berlin charlottenbrug` (note the typo) | 108 ops/sec


Setting `completion` to `false` speeds things up:

test | performance
-----|------------
completion – `Münc Hbf` | 592 ops/sec
no completion – `Münc Hbf` | 12635 ops/sec


## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/db-stations-autocomplete/issues).
