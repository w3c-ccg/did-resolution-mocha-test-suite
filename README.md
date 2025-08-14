# DID Resolution Test Suite

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [Test Data](#test-data)
- [Implementation](#implementation)


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

```js
  "issuers": [{
    // ... issuer settings here
  }],
  "verifiers": [{
    // ... verifier settings here
  }],
  "didResolvers": [{
    "id": "..."
    "endpoint": "...",
    "tags": ["did-resolution"]
  }]
```

## LICENSE

[BSD-3-Clause](LICENSE) Copyright 2022-2025 Digital Bazaar, Inc.
