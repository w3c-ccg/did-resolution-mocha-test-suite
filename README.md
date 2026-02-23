# DID Resolution Test Suite

## Table of Contents

- [DID Resolution Test Suite](#did-resolution-test-suite)
  - [Table of Contents](#table-of-contents)
  - [Background](#background)
  - [Install](#install)
  - [Usage](#usage)
  - [Implementations](#implementations)
  - [LICENSE](#license)


## Background

Provides interoperability tests for the [DID Resolution specification](https://www.w3.org/TR/did-resolution/)

## Install

```sh
$ npm i
```

## Usage

```sh
$ npm test
```

## Implementations

This test suite loads implementation descriptions from
https://github.com/w3c-ccg/vc-test-suite-implementations

To add your implementation to this test suite,
[follow the instructions there.](https://github.com/w3c-ccg/vc-test-suite-implementations?tab=readme-ov-file#adding-a-new-implementation)

This specific test suites needs a `didResolvers` section defined where implementation
endpoints are tagged with `did-resolution`.

Additionally, a set of `supportedDids` providing test cases that the test suite will exercise.
Implementations must provide at least one `valid` DID that can be successfully resolved, and
where possible should a test case for `deactivated` and `notFound` DIDs.

Each test case is an object, defining a `did` and any additional `resolutionOptions` required
for the resolver to resolve that DID.

See the example below:

```json
  "issuers": [{
    // ... issuer settings here
  }],
  "verifiers": [{
    // ... verifier settings here
  }],
  "didResolvers": [{
    "id": "...",
    "endpoint": "...",
    "tags": ["did-resolution"],
    "supportedDids": {
      "valid": [
        {
          "did": "did:key:z2J9gcGbsEDUmANXS8iJTVefK5t4eCx9x5k8jr8EyXWekTiEet6Jt6gwup2aWawzhHyMadvVMFcQ3ruwqg1Y8rYzjto1ccQu",
          "resolutionOptions": {}
        }
      ],
      "notFound": [
        {
          "did": "did:x:z2J9gcGbsEDUmANXS8iJTVefK5t4eCx9x5k8jr8EyXWekTiEet6Jt6gwup2aWawzhHyMadvVMFcQ3ruwqg1Y8rYzjto1ccQu",
          "resolutionOptions": {}
        }
      ],
      "deactivated": [
        {
          "did": "did:y:z2J9gcGbsEDUmANXS8iJTVefK5t4eCx9x5k8jr8EyXWekTiEet6Jt6gwup2aWawzhHyMadvVMFcQ3ruwqg1Y8rYzjto1ccQu",
          "resolutionOptions": {}
        }
      ]
    }
  }]
```

## LICENSE

[BSD-3-Clause](LICENSE) Copyright 2022-2025 Digital Bazaar, Inc.
