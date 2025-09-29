import * as chai from 'chai';
import {filterByTag} from 'vc-test-suite-implementations';
import {helpers} from 'mocha-w3c-interop-reporter';
import { checkSuccessfulResolutionResult, checkErrorResolutionResult } from './assertions.js';
import { nonAsciiStrings } from './negativeTestCases.js';
import { addQueryParametersToUrl } from './helpers.js';

// eslint-disable-next-line no-unused-vars
const should = chai.should();
const expect = chai.expect;
const tag = 'did-resolution';
const {match} = filterByTag({tags: [tag], property: 'didResolvers'});


describe('DID Parameters', function() {
  helpers.setupMatrix.call(this, match);
  for(const [name, implementation] of match) {
    const endpoint = implementation.settings.didResolvers[0].endpoint;
    const validRequest = implementation.settings.didResolvers[0].supportedDids.valid[0];
    const baseUrl = `${endpoint}/${validRequest.did}`;
    const url = addQueryParametersToUrl(baseUrl, validRequest.resolutionOptions);

    describe(name, function() {

      it('service parameter MUST be an ASCII string if present', async function() {
        for(const badService of nonAsciiStrings) {
          const urlWithService = addQueryParametersToUrl(url, {service: badService});
          const rv = await fetch(urlWithService);

          this.test.link = `https://w3c.github.io/did-resolution/#types:~:text=${encodeURIComponent('Identifies a service from the DID document by service ID. If present, the associated value MUST be an ASCII string.')}`;

          rv.ok.should.be.false;
          rv.status.should.equal(400);
          // const resolutionResult = await rv.json();
          // checkErrorResolutionResult(resolutionResult);
          // expect(result.error).to.equal('invalidDid');
        }
      });
    });
  }

});