import {test, expect, describe} from 'vitest';
import {VectorTile} from '@mapbox/vector-tile';
import Pbf from 'pbf';
import {isValid} from '@maplibre/vtvalidate';
import mvtf, {Fixture} from '@mapbox/mvt-fixtures';
import {fromVectorTileJs} from '../index';

describe('vector-tile-js', () => {
  // See https://github.com/mapbox/mvt-fixtures/blob/master/FIXTURES.md for
  // fixture descriptions
  mvtf.each((fixture: Fixture) => {
    // skip invalid tiles
    if (!fixture.validity.v2) return;

    test('mvt-fixtures: ' + fixture.id + ' ' + fixture.description, () => {
      const original = new VectorTile(new Pbf(new Uint8Array(fixture.buffer)));

      if (fixture.id === '020') {
        console.log('Skipping test due to https://github.com/mapbox/vt-pbf/issues/30');
        return;
      }

      if (fixture.id === '049' || fixture.id === '050') {
        console.log('Skipping test due to https://github.com/mapbox/vt-pbf/issues/31');
        return;
      }

      const buff = fromVectorTileJs(original);
      const roundtripped = new VectorTile(new Pbf(buff));

      isValid(buff, (error: Error, message: string) => {
        if (error) {
          throw error;
        }

        // UNKOWN geometry type is valid in the spec, but vtvalidate considers
        // it an error
        if (fixture.id === '016' || fixture.id === '039') {
          message = '';
        }

        expect(!message).toBeTruthy();

        // Compare roundtripped features with originals
        for (const name in original.layers) {
          const originalLayer = original.layers[name];
          expect(roundtripped.layers[name]).toBeTruthy();
          const roundtrippedLayer = roundtripped.layers[name];
          expect(roundtrippedLayer.length).toEqual(originalLayer.length);
          for (let i = 0; i < originalLayer.length; i++) {
            const actual = roundtrippedLayer.feature(i);
            const expected = originalLayer.feature(i);

            expect(actual.id).toEqual(expected.id);
            expect(actual.type).toEqual(expected.type);
            expect(actual.properties).toEqual(expected.properties);
            expect(actual.loadGeometry()).toEqual(expected.loadGeometry());
          }
        }
      });
    });
  });
});
