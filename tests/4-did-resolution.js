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

// Add resolutionOptions as query parameters to a base URL
function addResolutionOptionsToUrl(baseUrl, resolutionOptions = {}) {
  const url = new URL(baseUrl);
  for(const [key, value] of Object.entries(resolutionOptions)) {
    url.searchParams.append(key, value);
  }
  return url.toString();
}

describe('DID Resolution', function() {
  helpers.setupMatrix.call(this, match);
  for(const [name, implementation] of match) {
    const endpoint = implementation.settings.didResolvers[0].endpoint;
    describe(name, function() {
      beforeEach(helpers.setupRow);
      for(const resolutionRequest of
        implementation.settings.didResolvers[0].supportedDids.valid) {
        const {did, resolutionOptions} = resolutionRequest;
        const baseUrl = `${endpoint}/${did}`;
        const url = addResolutionOptionsToUrl(baseUrl, resolutionOptions);
        it('All conformant DID resolvers MUST implement the DID resolution ' +
          'function for at least one DID method', async function() {
          // Ask Markus about resolution options here.
          // resolve(did, resolutionOptions)
          // const url = `${endpoint}/${did}`;
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

        it('The resolutionOptions input is REQUIRED, but the structure ' +
          'MAY be empty.', async function() {
          // TODO: Not sure how to test this one.?
          // HTTPS Binding ensures that the resolutionOptions is
          // the empty object if no options are provided.
        });
        it('The didResolutionMetadata structure is REQUIRED.',
          async function() {
            const url = `${endpoint}/${did}`;
            const rv = await fetch(url);
            this.test.link = `https://w3c.github.io/did-resolution/#types:~:text=${encodeURIComponent('A metadata structure consisting of values relating to the results of the DID resolution process. This structure is REQUIRED')}`;
            rv.ok.should.be.true;
            rv.status.should.equal(200);
            const resolutionResult = await rv.json();
            resolutionResult.should.have.property('didResolutionMetadata');
          }
        );
        it('If resolution is successful, the didDocument MUST be a conformant' +
          'DID document', async function() {
          const url = `${endpoint}/${did}`;
          const rv = await fetch(url);
          this.test.link = `https://w3c.github.io/did-resolution/#types:~:text=${encodeURIComponent('If the resolution is successful, this MUST be a DID document that is capable of being represented in one of the conformant representations of the Decentralized Identifiers (DIDs) v1.0 specification.')}`;
          rv.ok.should.be.true;
          rv.status.should.equal(200);
          const resolutionResult = await rv.json();
          resolutionResult.should.have.property('didDocument');
          resolutionResult.didDocument.id.should.equal(did);
        });
        

      }
      it('The did input is REQUIRED', async function() {
        const url = `${endpoint}/`; // No DID provided
        const rv = await fetch(url);
        this.test.link = `https://w3c.github.io/did-resolution/#types:~:text=${encodeURIComponent('This is the DID to resolve. This input is REQUIRED')}`;
        rv.ok.should.be.false;
        rv.status.should.equal(400);

        // QUESTION: Should this still have a problem details error?
        // Currently the spec doesnt define how to handle this case
      });
      const unconformantDids = ['not-a-did', 'did:example'];
      for(const badDid of unconformantDids) {

        it('The did input value MUST be a conformant DID as defined' +
            ' in Decentralized Identifiers (DIDs) v1.0.', async function() {

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
          
        });
      }
      const {did, resolutionOptions} = implementation.settings.didResolvers[0].supportedDids.valid[0]
      let baseUrl = `${endpoint}/${did}`;
      baseUrl = addResolutionOptionsToUrl(baseUrl, resolutionOptions);

      const badMediaTypes = ['application/😊', 123];
      for(const badMediaType of badMediaTypes) {
        it('The Media Type MUST be expressed as an ASCII string.',
          async function() {
            const badUrl = new URL(baseUrl);
            badUrl.searchParams.append('accept', badMediaType);
            const url = badUrl.toString();
            const rv = await fetch(url);

            rv.ok.should.be.false;
            rv.status.should.equal(400);

            const resolutionResult = await rv.json();
            resolutionResult.should.have.property('didResolutionMetadata');
            resolutionResult.didResolutionMetadata
              .should.have.property('error');
            resolutionResult.didResolutionMetadata.error.type
              .should.equal('INVALID_OPTIONS');
          });

      }
    });
  }
});
