[![MapLibre Logo](https://maplibre.org/img/maplibre-logo-big.svg)](https://maplibre.org/)

# vt-pbf 
[![NPM Version](https://img.shields.io/npm/v/@maplibre/vt-pbf.svg)](https://www.npmjs.com/package/@maplibre/vt-pbf)

Serialize [Mapbox vector tiles](https://github.com/mapbox/vector-tile-spec) to binary protobufs in javascript.

## Installation
Using NPM: `npm install @maplibre/vt-pbf`

Or `npm run build` and find build artifacts in `dist/`

## Usage

## From vector-tile-js

```javascript
import {fromVectorTileJs} from 'vt-pbf'
import {VectorTile} = from '@mapbox/vector-tile'
import Protobuf from 'pbf'

var data = fs.readFileSync(__dirname + '/fixtures/rectangle-1.0.0.pbf')
var tile = new VectorTile(new Protobuf(data))
var orig = tile.layers['geojsonLayer'].feature(0).toGeoJSON(0, 0, 1)

var buff = fromVectorTileJs(tile)
fs.writeFileSync('my-tile.pbf', buff)
```
