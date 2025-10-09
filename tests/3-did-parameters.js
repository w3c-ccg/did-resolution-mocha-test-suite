import * as chai from 'chai';
import {addQueryParametersToUrl} from './helpers.js';
import {checkSuccessfulResolutionResult} from './assertions.js';
import {filterByTag} from 'vc-test-suite-implementations';
import {helpers} from 'mocha-w3c-interop-reporter';
import {nonAsciiStrings} from './negativeTestCases.js';

// eslint-disable-next-line no-unused-vars
const should = chai.should();
const tag = 'did-resolution';
const {match} = filterByTag({tags: [tag], property: 'didResolvers'});

describe('DID Parameters', function() {
  helpers.setupMatrix.call(this, match);
  for(const [name, implementation] of match) {
    const endpoint = implementation.settings.didResolvers[0].endpoint;
    const validRequest = implementation.settings.didResolvers[0]
      .supportedDids.valid[0];

    const baseUrl = `${endpoint}/${validRequest.did}`;
    const url = addQueryParametersToUrl(baseUrl,
      validRequest.resolutionOptions);

    describe(name, function() {

      it('service parameter MUST be an ASCII string if present',
        async function() {
          for(const badService of nonAsciiStrings) {
            const urlWithService = addQueryParametersToUrl(url,
              {service: badService});
            const rv = await fetch(urlWithService);

            this.test.link = `https://w3c.github.io/did-resolution/#types:~:text=${encodeURIComponent('Identifies a service from the DID document by service ID. If present, the associated value MUST be an ASCII string.')}`;

            rv.ok.should.be.false;
            rv.status.should.equal(400);
          }

          const validService = 'linkedDomain';
          const urlWithService = addQueryParametersToUrl(url,
            {service: validService});
          const rv = await fetch(urlWithService);
          rv.ok.should.be.true;
          rv.status.should.equal(200);

        });

      it('serviceType parameter MUST be an ASCII string if present',
        async function() {
          for(const badServiceType of nonAsciiStrings) {
            const urlWithServiceType = addQueryParametersToUrl(url,
              {serviceType: badServiceType});
            const rv = await fetch(urlWithServiceType);

            this.test.link = `https://w3c.github.io/did-resolution/#types:~:text=${encodeURIComponent('Identifies a set of one or more services from the DID document by service type. If present, the associated value MUST be an ASCII string.')}`;

            rv.ok.should.be.false;
            rv.status.should.equal(400);
          }

          const validServiceType = 'LinkedDomain';
          const urlWithServiceType = addQueryParametersToUrl(url,
            {service: validServiceType});
          const rv = await fetch(urlWithServiceType);
          rv.ok.should.be.true;
          rv.status.should.equal(200);

        });

      it('relativeRef parameter MUST be an ASCII string if present',
        async function() {
          for(const badRelativeRef of nonAsciiStrings) {
            const urlWithRelativeRef = addQueryParametersToUrl(url,
              {relativeRef: badRelativeRef});
            const rv = await fetch(urlWithRelativeRef);

            this.test.link = `https://w3c.github.io/did-resolution/#types:~:text=${encodeURIComponent('If present, the associated value MUST be an ASCII string and MUST use percent-encoding for certain characters as specified in RFC3986 Section 2.1.')}`;

            rv.ok.should.be.false;
            rv.status.should.equal(400);
          }

        });

      const noPercentEncodingRelativeRef = [
        'my path/file', // space not percent-encoded
        'file#section', // # not percent-encoded
        'dir/with?query=value', // ? not percent-encoded
      ];

      it('relativeRef parameter MUST use percent-encoding for certain' +
        'characters as specified in RFC3986 Section 2.1.', async function() {
        // TODO: Implement this test properly

        for(const badRelativeRef of noPercentEncodingRelativeRef) {
          const urlWithRelativeRef = addQueryParametersToUrl(url,
            {relativeRef: badRelativeRef});
          const rv = await fetch(urlWithRelativeRef);

          this.test.link = `https://w3c.github.io/did-resolution/#types:~:text=${encodeURIComponent('If present, the associated value MUST be an ASCII string and MUST use percent-encoding for certain characters as specified in RFC3986 Section 2.1.')}`;

          rv.ok.should.be.false;
          rv.status.should.equal(400);
        }

        const relativeRef = 'my%20path/file'; // space percent-encoded
        const urlWithRelativeRef = addQueryParametersToUrl(url, {relativeRef});
        const rv = await fetch(urlWithRelativeRef);
        rv.ok.should.be.true;
        rv.status.should.equal(200);

      });

      it('versionId parameter MUST be an ASCII string if present',
        async function() {
          for(const badVersionId of nonAsciiStrings) {
            const urlWithVersionId = addQueryParametersToUrl(url,
              {versionId: badVersionId});
            const rv = await fetch(urlWithVersionId);

            this.test.link = `https://w3c.github.io/did-resolution/#types:~:text=${encodeURIComponent('Identifies a specific version of a DID document to be resolved (the version ID could be sequential, or a UUID, or method-specific). If present, the associated value MUST be an ASCII string.')}`;

            rv.ok.should.be.false;
            rv.status.should.equal(400);

          }
        });
    });

    it('versionTime parameter MUST be an ASCII string if present',
      async function() {
        for(const badVersionTime of nonAsciiStrings) {
          const urlWithVersionTime = addQueryParametersToUrl(url,
            {versionTime: badVersionTime});
          const rv = await fetch(urlWithVersionTime);

          this.test.link = `https://w3c.github.io/did-resolution/#types:~:text=${encodeURIComponent('versionTime. If present, the associated value MUST be an ASCII string')}`;

          rv.ok.should.be.false;
          rv.status.should.equal(400);

        }
      });

    const invalidXmlDateTimes = [
      '2025-10-07 12:30:45', // Space instead of 'T'
      '2025/10/07T12:30:45', // Wrong date separator
      '2025-13-07T12:30:45', // Invalid month (13)
      '2025-10-32T12:30:45', // Invalid day (32)
      '2025-10-07T25:00:00', // Invalid hour (25)
      '2025-10-07T12:30:60', // Invalid second (60)
      '2025-10-07T12:30:45+24:00', // Invalid timezone offset
      '2025-10-07', // Missing time component
      '2025-10-07T12:30:45abc', // Trailing invalid characters
      'T12:30:45' // Missing date
    ];

    it('versionTime parameter MUST be a valid XML datetime value if present',
      async function() {
        for(const badXmlDateTime of invalidXmlDateTimes) {
          const urlWithVersionTime = addQueryParametersToUrl(url,
            {versionTime: badXmlDateTime});
          const rv = await fetch(urlWithVersionTime);

          this.test.link = `https://w3c.github.io/did-resolution/#types:~:text=${encodeURIComponent('If present, the associated value MUST be an ASCII string which is a valid XML datetime value, as defined in section 3.3.7 of W3C XML Schema Definition Language (XSD) 1.1 Part 2: Datatypes')}`;

          rv.ok.should.be.false;
          rv.status.should.equal(400);

        }

      });

    const notNormalizedXmlDateTimes = [
      '2025-10-07T00:00:00+02:00', // Not UTC, has offset +02:00
      '2025-10-07T00:00:00-05:00', // Not UTC, has offset -05:00
      '2025-10-07T00:00:00', // No timezone indicator (ambiguous)
      '2025-10-07T00:00:00.123Z', // Has sub-second precision
      '2025-10-07T00:00:00.999+01:00' // Fractional seconds + offset
    ];

    it('versionTime parameter MUST be normalized to UTC 00:00:00 and without' +
      'sub-second decimal precision. ', async function() {
      for(const badXmlDateTime of notNormalizedXmlDateTimes) {
        const urlWithVersionTime = addQueryParametersToUrl(url,
          {versionTime: badXmlDateTime});
        const rv = await fetch(urlWithVersionTime);

        rv.ok.should.be.false;
        rv.status.should.equal(400);

      }

      const normalizedDateTime = '2025-10-07T14:30:00Z';
      const urlWithVersionTime = addQueryParametersToUrl(url,
        {versionTime: normalizedDateTime});
      const rv = await fetch(urlWithVersionTime);

      this.test.link = `https://w3c.github.io/did-resolution/#types:~:text=${encodeURIComponent('This datetime value MUST be normalized to UTC 00:00:00 and without sub-second decimal precision.')}`;

      rv.ok.should.be.true;
      rv.status.should.equal(200);

      const resolutionResult = await rv.json();

      checkSuccessfulResolutionResult(resolutionResult);
    });

    it('hl parameter MUST be an ASCII string if present', async function() {
      for(const badHashLink of nonAsciiStrings) {
        const urlWithHl = addQueryParametersToUrl(url, {hl: badHashLink});
        const rv = await fetch(urlWithHl);

        this.test.link = `https://w3c.github.io/did-resolution/#types:~:text=${encodeURIComponent('A resource hash of the DID document to add integrity protection, as specified in [HASHLINK]. This parameter is non-normative. If present, the associated value MUST be an ASCII string.')}`;

        rv.ok.should.be.false;
        rv.status.should.equal(400);

      }
    });

  }

});
