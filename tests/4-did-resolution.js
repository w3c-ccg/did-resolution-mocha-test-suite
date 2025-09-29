/*!
 * Copyright (c) 2025 Digital Bazaar, Inc.
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */
import * as chai from 'chai';
import {filterByTag} from 'vc-test-suite-implementations';
import {helpers} from 'mocha-w3c-interop-reporter';
import { checkSuccessfulResolutionResult, checkErrorResolutionResult } from './assertions.js';
import {nonAsciiStrings} from './negativeTestCases.js';
import {addQueryParametersToUrl} from './helpers.js';

// eslint-disable-next-line no-unused-vars
const should = chai.should();
const expect = chai.expect;
const tag = 'did-resolution';
const {match} = filterByTag({tags: [tag], property: 'didResolvers'});


describe('DID Resolution', function() {
  helpers.setupMatrix.call(this, match);
  for(const [name, implementation] of match) {
    const endpoint = implementation.settings.didResolvers[0].endpoint;
    describe(name, function() {
      beforeEach(helpers.setupRow);
      const validDids = implementation.settings.didResolvers[0].supportedDids.valid;

      it('Implementation has at least one valid DID to test', function() {
        expect(validDids.length).to.be.greaterThan(0);
      });

      validDids.forEach(({did, resolutionOptions}) => {

        const baseUrl = `${endpoint}/${did}`;
        let url = addQueryParametersToUrl(baseUrl, resolutionOptions);
        it('All conformant DID resolvers MUST implement the DID resolution ' +
          'function for at least one DID method', async function() {

          const rv = await fetch(url);
          this.test.link = `https://w3c.github.io/did-resolution/#types:~:text=All%20conformant%20DID%20resolvers%20MUST%20implement%20the%20DID%20resolution%20function%20for%20at%20least%20one%20DID%20method%20and%20MUST%20be%20able%20to%20return%20a%20DID%20document%20in%20at%20least%20one%20conformant%20representation.`;

          rv.ok.should.be.true;
          rv.status.should.equal(200);
          rv.headers.get('content-type')
            .should.include('application/did-resolution');
          const resolutionResult = await rv.json();

          checkSuccessfulResolutionResult(resolutionResult);

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

        it('If the contentType property is present, the value of this ' +
          'property MUST be an ASCII string that is the Media Type of' +
          'the conformant representations.', async function() {
          const contentType = 'application/did';

          const rv = await fetch(url);
          this.test.link = `https://w3c.github.io/did-resolution/#types:~:text=${encodeURIComponent('If present, the value of this property MUST be an ASCII string that is the Media Type of the conformant representations.')}`;
          rv.ok.should.be.true;
          const resolutionResult = await rv.json();
          resolutionResult.should.have.property('didResolutionMetadata');

          if(resolutionResult.didResolutionMetadata.contentType) {
            resolutionResult.didResolutionMetadata.contentType.should.equal(contentType);
          }
        });

        it('If the proof property is present, the value of this ' +
          'property MUST be a set where each item is a map that contains a proof.', 
        async function() {

          const contentType = 'application/did';

          const rv = await fetch(url);
          this.test.link = `https://w3c.github.io/did-resolution/#types:~:text=${encodeURIComponent('DID resolution metadata MAY include a proof property. If present, the value MUST be a set where each item is a map that contains a proof.')}`;
          rv.ok.should.be.true;
          const resolutionResult = await rv.json();
          resolutionResult.should.have.property('didResolutionMetadata');

          if(resolutionResult.didResolutionMetadata.proof) {
            resolutionResult.didResolutionMetadata.proot.should.be.an('array');
          }
        });

      });

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
        });
        it('Produces a INVALID_DID error and conformant resolution result',
          async function() {

            const url = `${endpoint}/${badDid}`;
            const rv = await fetch(url);
            this.test.link = `https://w3c.github.io/did-resolution/#types:~:text=${encodeURIComponent('Validate that the input DID conforms to the did rule of the DID Syntax. If not, the DID resolver MUST return the following result:')}`;
            rv.ok.should.be.false;
            rv.status.should.equal(400);
            // rv.headers.get('content-type')
            //   .should.include('application/did-resolution');
            const resolutionResult = await rv.json();
            checkErrorResolutionResult(resolutionResult, 'INVALID_DID');
          });
        it('The error property is REQUIRED when there is an error in the' +
          ' resolution process.', async function() {

          const url = `${endpoint}/${badDid}`;
          const rv = await fetch(url);
          this.test.link = `https://w3c.github.io/did-resolution/#types:~:text=${encodeURIComponent('This property is REQUIRED when there is an error in the resolution process.')}`;
          rv.ok.should.be.false;
          rv.status.should.equal(400);
          const resolutionResult = await rv.json();
          resolutionResult.should.have.property('didResolutionMetadata');
          resolutionResult.didResolutionMetadata
            .should.have.property('error');
        });



      }
      const {did, resolutionOptions} = implementation.settings.didResolvers[0].supportedDids.valid[0]
      let baseUrl = `${endpoint}/${did}`;
      baseUrl = addQueryParametersToUrl(baseUrl, resolutionOptions);

      
      it('The Media Type MUST be expressed as an ASCII string.',
        async function() {
          for(const badMediaType of nonAsciiStrings) {
            const badUrl = new URL(baseUrl);
            badUrl.searchParams.append('accept', badMediaType);
            const url = badUrl.toString();
            const rv = await fetch(url);

            this.test.link = `https://w3c.github.io/did-resolution/#types:~:text=${encodeURIComponent('The Media Type MUST be expressed as an ASCII string. The DID resolver implementation')}`;

            rv.ok.should.be.false;
            rv.status.should.equal(400);

          }
        });

      const unsupportedDidMethod = 'did:unsupported:123456789abcdefghi';
      it('If the DID method is not supported, produces a ' +
        'METHOD_NOT_SUPPORTED error and conformant resolution result',
      async function() {
        const url = `${endpoint}/${unsupportedDidMethod}`;
        const rv = await fetch(url);
        this.test.link = `https://w3c.github.io/did-resolution/#types:~:text=${encodeURIComponent('Determine whether the DID method of the input DID is supported by the DID resolver that implements this algorithm. If not, the DID resolver MUST return the following result:')}`;
        rv.ok.should.be.false;
        // TODO: Is 501 required by the spec?
        // rv.status.should.equal(501);
        // rv.headers.get('content-type')
        //   .should.include('application/did-resolution');
        const resolutionResult = await rv.json();
        checkErrorResolutionResult(resolutionResult, 'METHOD_NOT_SUPPORTED');
      }
      );

    });

  }
});
