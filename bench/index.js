var fs = require('fs')
var path = require('path')
var Pbf = require('pbf')
var VectorTile = require('@mapbox/vector-tile').VectorTile
var Benchmark = require('benchmark')
var serialize = require('../')

var raw = fs.readFileSync(path.join(__dirname, '../test/fixtures/rectangle-1.0.0.pbf'))
var rawTile = new VectorTile(new Pbf(raw))
serialize(rawTile)

var suite = new Benchmark.Suite('vt-pbf')
suite
    .add('raw', function () {
        serialize(rawTile)
    })
    .on('cycle', function (event) {
        console.log(String(event.target))
    })
    .run()
