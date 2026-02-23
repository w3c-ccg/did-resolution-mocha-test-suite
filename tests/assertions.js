import assert from 'node:assert/strict';

export function checkSuccessfulResolutionResult(resolutionResult) {
  resolutionResult.should.be.an('object');
  resolutionResult.should.have.property('didResolutionMetadata');
  resolutionResult.didResolutionMetadata.should.be.an('object');
  resolutionResult.should.have.property('didDocument');
  resolutionResult.didDocument.should.be.an('object');
  checkConformantDidDocument(resolutionResult.didDocument);
  resolutionResult.should.have.property('didDocumentMetadata');
  resolutionResult.didDocumentMetadata.should.be.an('object');
}

export function checkErrorResolutionResult(resolutionResult,
  expectedErrorType) {

  resolutionResult.should.be.an('object');
  resolutionResult.should.have.property('didResolutionMetadata');
  resolutionResult.didResolutionMetadata.should.be.an('object');
  resolutionResult.didResolutionMetadata.should.have.property('error');
  resolutionResult.didResolutionMetadata.error.should.be.an('object');
  resolutionResult.didResolutionMetadata.error.should.have.property('type');
  if(expectedErrorType) {
    resolutionResult.didResolutionMetadata.error.type.should
      .equal(expectedErrorType);
  }
  resolutionResult.should.have.property('didDocument');
  resolutionResult.didDocument.should.be.null;
  resolutionResult.should.have.property('didDocumentMetadata');
  resolutionResult.didDocumentMetadata.should.be.an('object');
}

export function checkConformantDidDocument(didDocument) {
  didDocument.should.be.an('object');
  didDocument.should.have.property('id');
  didDocument.id.should.be.a('string');
  didDocument.should.have.property('@context');
  if(typeof didDocument['@context'] === 'string') {
    didDocument['@context'].should.equal('https://www.w3.org/ns/did/v1');
  } else {
    didDocument['@context'].should.be.an('array');
    didDocument['@context'].should.contain('https://www.w3.org/ns/did/v1');
  }
}
