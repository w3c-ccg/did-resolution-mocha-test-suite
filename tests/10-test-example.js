/*!
 * Copyright (c) 2025 Digital Bazaar, Inc.
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */
import * as chai from 'chai';
import {createRequire} from 'node:module';
import {filterByTag} from 'vc-test-suite-implementations';
import {helpers} from 'mocha-w3c-interop-reporter';

// eslint-disable-next-line no-unused-vars
const should = chai.should();

const tag = 'did-resolution';
const {match} = filterByTag({tags: [tag], property: 'didResolvers'});

const require = createRequire(import.meta.url);
const dids = require('./dids.json');

describe('Example Test Suite', function() {
  helpers.setupMatrix.call(this, match);
  for(const [name, implementation] of match) {
    describe(name, function() {
      beforeEach(helpers.setupRow);
      for(const did of implementation.settings.didResolvers[0].supportedDids.valid) {
        it(did, async function() {
          const endpoint = implementation.settings.didResolvers[0].endpoint;
          const url = `${endpoint}/${did}`;
          const rv = await fetch(url);
          // TODO: should we test if failures are handled correctly here also?
          rv.ok.should.be.true;
          rv.status.should.equal(200);
          rv.headers.get('content-type')
            .should.include('application/did-resolution');
          const doc = await rv.json();
          doc.should.have.property('didResolutionMetadata');
          doc.should.have.property('didDocument');
          doc.didDocument.id.should.equal(did);
          doc.should.have.property('didDocumentMetadata');
        });
      }
    });
  }
});


// There are tests that can be written that do no depend on input from the DID resolver implementation.


// Each test case will need to define resolutionOption

// We likely want to use JSON schema to 

// Manu suggests multiple files. one per section of the spec.
// Use numbers to identify the order that the tests will run
//


// See finished test suite. E.g. vc-data-model-2.-