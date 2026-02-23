import * as chai from 'chai';
import {checkErrorResolutionResult,
  checkSuccessfulResolutionResult} from './assertions.js';
import {addQueryParametersToUrl} from './helpers.js';
import {filterByTag} from 'vc-test-suite-implementations';
import {helpers} from 'mocha-w3c-interop-reporter';
import {nonAsciiStrings} from './negativeTestCases.js';

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
      const validDids = implementation.settings.didResolvers[0]
        .supportedDids.valid;

      it('Implementation has at least one valid DID to test', function() {
        expect(validDids.length).to.be.greaterThan(0);
      });

      validDids.forEach(({did, resolutionOptions}) => {

        const baseUrl = `${endpoint}/${did}`;
        const url = addQueryParametersToUrl(baseUrl, resolutionOptions);
        it('All conformant DID resolvers MUST implement the DID resolution ' +
          'function for at least one DID method', async function() {

          const rv = await fetch(url);
          this.test.link = `https://w3c.github.io/did-resolution/#types:~:text=All%20conforming%20DID%20resolvers%20MUST%20implement%20the%20DID%20resolution%20function%20for%20at%20least%20one%20DID%20method`;

          rv.ok.should.be.true;
          rv.status.should.equal(200);
          rv.headers.get('content-type')
            .should.include('application/did-resolution');
          const resolutionResult = await rv.json();

          checkSuccessfulResolutionResult(resolutionResult);
        });

        it('The resolutionOptions input is REQUIRED, but the structure ' +
          'MAY be empty.', async function() {

          this.test.link = 'https://w3c.github.io/did-resolution/#types:~:text=Resolution%20Options.-,This%20input%20is%20REQUIRED%2C%20but%20the%20structure%20MAY%20be%20empty.,-This%20function%20returns';
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
          ' DID document', async function() {
          const url = `${endpoint}/${did}`;
          const rv = await fetch(url);
          this.test.link = `https://w3c.github.io/did-resolution/#types:~:text=If%20the%20resolution%20is%20successful%2C%20this%20MUST%20be%20a%20DID%20document%20that%20is%20capable%20of%20being%20represented%20in%20one%20of%20the%20conformant%20representations%20of%20the%20Decentralized%20Identifiers%20(DIDs)%20v1.0%20specification`;
          rv.ok.should.be.true;
          rv.status.should.equal(200);
          const resolutionResult = await rv.json();
          resolutionResult.should.have.property('didDocument');
        });

        it('The value of id in the resolved DID document MUST ' +
          'match the DID that was resolved', async function() {
          const url = `${endpoint}/${did}`;
          const rv = await fetch(url);
          this.test.link = `https://w3c.github.io/did-resolution/#types:~:text=The%20value%20of%20id%20in%20the%20resolved%20DID%20document%20MUST%20be%20string%20equal%20to%20the%20DID%20that%20was%20resolved.`;
          rv.ok.should.be.true;
          rv.status.should.equal(200);
          const resolutionResult = await rv.json();
          resolutionResult.should.have.property('didDocument');
          resolutionResult.didDocument.id.should.equal(did);
        });

        it('If the resolution is successful, the `didDocumentMetadata` ' +
          'MUST be a metadata structure', async function() {
          const url = `${endpoint}/${did}`;
          const rv = await fetch(url);
          this.test.link = `https://w3c.github.io/did-resolution/#did-resolution-options:~:text=If%20the%20resolution%20is%20successful%2C%20this%20MUST%20be%20a%20metadata%20structure`;
          rv.ok.should.be.true;
          rv.status.should.equal(200);
          const resolutionResult = await rv.json();
          resolutionResult.should.have.property('didDocumentMetadata');
          resolutionResult.didDocumentMetadata.should.be.an('object');
        });
      });

      it('The did input to the resolve function is REQUIRED', async function() {
        const url = `${endpoint}/`; // No DID provided
        const rv = await fetch(url);
        this.test.link = `https://w3c.github.io/did-resolution/#types:~:text=This%20input%20is%20REQUIRED%20and%20the%20value%20MUST%20be%20a%20conformant%20DID%20as%20defined%20in%20Decentralized%20Identifiers%20(DIDs)%20v1.0.`;
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
            checkErrorResolutionResult(resolutionResult, 'https://www.w3.org/ns/did#INVALID_DID');
          });
        it('The error property in DID Document Metadata is REQUIRED when ' +
          'there is an error in the resolution process.', async function() {

          const url = `${endpoint}/${badDid}`;
          const rv = await fetch(url);
          this.test.link = `https://w3c.github.io/did-resolution/#types:~:text=If%20the%20resolution%20is%20unsuccessful%2C%20this%20structure%20MUST%20contain%20an%20error%20property%20describing%20the%20error.`;
          rv.ok.should.be.false;
          rv.status.should.equal(400);
          const resolutionResult = await rv.json();
          resolutionResult.should.have.property('didResolutionMetadata');
          resolutionResult.didResolutionMetadata
            .should.have.property('error');
        });

        it('If the resolution is unsuccessful, the `didDocumentMetadata` ' +
          'output MUST be an empty metadata structure', async function() {

          const url = `${endpoint}/${badDid}`;
          const rv = await fetch(url);
          this.test.link = `https://w3c.github.io/did-resolution/#did-resolution-options:~:text=If%20the%20resolution%20is%20unsuccessful%2C%20this%20output%20MUST%20be%20an%20empty%20metadata%20structure.`;
          rv.ok.should.be.false;
          rv.status.should.equal(400);
          const resolutionResult = await rv.json();
          resolutionResult.should.have.property('didDocumentMetadata');
          resolutionResult.didDocumentMetadata.should.deep.equal({});
        });

      }
      const {did, resolutionOptions} = implementation.settings.didResolvers[0]
        .supportedDids.valid[0];
      let baseUrl = `${endpoint}/${did}`;
      baseUrl = addQueryParametersToUrl(baseUrl, resolutionOptions);

      const unsupportedDidMethod = 'did:unsupported:123456789abcdefghi';
      it('If the DID method is not supported, produces a ' +
        'METHOD_NOT_SUPPORTED error and conformant resolution result',
      async function() {
        const url = `${endpoint}/${unsupportedDidMethod}`;
        const rv = await fetch(url);
        this.test.link = `https://w3c.github.io/did-resolution/#types:~:text=${encodeURIComponent('Determine whether the DID method of the input DID is supported by the DID resolver that implements this algorithm. If not, the DID resolver MUST return the following result:')}`;
        rv.ok.should.be.false;
        const resolutionResult = await rv.json();
        checkErrorResolutionResult(resolutionResult, 'https://www.w3.org/ns/did#METHOD_NOT_SUPPORTED');
      }
      );

    });

  }
});
