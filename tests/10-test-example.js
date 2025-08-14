/*!
 * Copyright (c) 2025 Digital Bazaar, Inc.
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */
import * as chai from 'chai';
import {filterByTag} from 'vc-test-suite-implementations';
import {helpers} from 'mocha-w3c-interop-reporter';

const should = chai.should();

const tag = 'BitstringStatusList';
const {match} = filterByTag({tags: [tag]});

describe('Example Test Suite', function() {
  helpers.setupMatrix.call(this, match);
  for(const [name] of match) {
    describe(name, function() {
      beforeEach(helpers.setupRow);
      it('should pass a basic test', function() {
        const expected = 42;
        const actual = 40 + 2;
        actual.should.equal(expected);
      });

      it('should fail a basic test', function() {
        const expected = 42;
        const actual = 40 + 1; // This will fail
        actual.should.equal(expected);
      });
    });
  }
});
