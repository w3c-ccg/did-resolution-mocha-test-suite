import * as chai from 'chai';
import assert from 'node:assert/strict';

const should = chai.should();

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
  assert(resolutionResult.didDocument === null,
    'didDocument MUST be null on error');
  resolutionResult.should.have.property('didDocumentMetadata');
  resolutionResult.didDocumentMetadata.should.be.an('object');
}

export function checkConformantDidDocument(didDocument) {
  didDocument.should.be.an('object');
  didDocument.should.have.property('id');
  didDocument.id.should.be.a('string');
}
