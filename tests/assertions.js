import Ajv from 'ajv';
import didSchema from './did-schema.json' with {type: 'json'};

const ajv = new Ajv({allErrors: true, strict: false, validateSchema: false});
const validateDidDocument = ajv.compile(didSchema);

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
  const isValid = validateDidDocument(didDocument);
  isValid.should.be.true();
}
