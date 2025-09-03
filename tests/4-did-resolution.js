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

describe('DID Resolution', function() {
  helpers.setupMatrix.call(this, match);
  for(const [name, implementation] of match) {
    describe(name, function() {
      beforeEach(helpers.setupRow);
      for(const did of implementation.settings.didResolvers[0].supportedDids.valid) {
        it('All conformant DID resolvers MUST implement the DID resolution ' +
          'function for at least one DID method', async function() {
          const endpoint = implementation.settings.didResolvers[0].endpoint;
          // Ask Markus about resolution options here.
          // resolve(did, resolutionOptions)
          const url = `${endpoint}/${did}`;
          const rv = await fetch(url);
          this.test.link = `https://w3c.github.io/did-resolution/#types:~:text=All%20conformant%20DID%20resolvers%20MUST%20implement%20the%20DID%20resolution%20function%20for%20at%20least%20one%20DID%20method%20and%20MUST%20be%20able%20to%20return%20a%20DID%20document%20in%20at%20least%20one%20conformant%20representation.`;
          
          // Question: This is testing 2 MUST statements. Should we split this into 2 tests?
          // All conformant DID resolvers MUST implement the DID resolution function for at least one DID method 
          // and MUST be able to return a DID document in at least one conformant representation.

          rv.ok.should.be.true;
          rv.status.should.equal(200);
          rv.headers.get('content-type')
            .should.include('application/did-resolution');
          const resolutionResult = await rv.json();
          resolutionResult.should.have.property('didResolutionMetadata');
          resolutionResult.should.have.property('didDocument');
          resolutionResult.didDocument.id.should.equal(did);
          resolutionResult.should.have.property('didDocumentMetadata');

          // TODO: Test resolutionResult.didDocument is conformant 
        });

        it('Ths did input is REQUIRED', async function() {
          const endpoint = implementation.settings.didResolvers[0].endpoint;
          const url = `${endpoint}/`; // No DID provided
          const rv = await fetch(url);
          this.test.link = `https://w3c.github.io/did-resolution/#types:~:text=${encodeURIComponent('This is the DID to resolve. This input is REQUIRED')}`;
          rv.ok.should.be.false;
          rv.status.should.equal(400);

          // QUESTION: Should this still have a problem details error? Currently the spec doesnt define how to hand
        });
        it('The did input value MUST be a conformant DID as defined' +
          ' in Decentralized Identifiers (DIDs) v1.0.', async function() {
          const endpoint = implementation.settings.didResolvers[0].endpoint;

          const unconformantDids = ['not-a-did', 'did:example'];

          for(const badDid of unconformantDids) {
            const url = `${endpoint}/${badDid}`;
            const rv = await fetch(url);
            this.test.link = `https://w3c.github.io/did-resolution/#types:~:text=The%20input%20parameter%20did%20is%20REQUIRED%20and%20the%20value%20MUST%20be%20a%20conformant%20DID%20as%20defined%20in%20Decentralized%20Identifiers%20(DIDs)%20v1.0.`;
            rv.ok.should.be.false;
            rv.status.should.equal(400);
            // rv.headers.get('content-type')
            //   .should.include('application/did-resolution');
            const resolutionResult = await rv.json();
            resolutionResult.should.have.property('didResolutionMetadata');
            resolutionResult.didResolutionMetadata
              .should.have.property('error');
            resolutionResult.didResolutionMetadata.error.type
              .should.equal('INVALID_DID');
          }
        });
        it('This resolutionOptions input is REQUIRED, but the structure ' +
          'MAY be empty.', async function() {
          // TODO: Not sure how to test this one.?
        });


      }
    });
  }
});
