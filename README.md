> [!WARNING]
> This is a template repository. The following README contents are for the final
> updated repository based on this template.
>
> After creating a new repository from this template, run...
> ```sh
> $ ./populate-templates.js org=<org> repo_name=<repo_name> title=<title>
> ```
>
> The contents below should be updated by hand to match the tests once they are
> written. This warning should also be removed.

# ${title} Test Suite

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [Test Data](#test-data)
- [Implementation](#implementation)


## Background

Provides interoperability tests for...

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

This specific test suites needs a `${key}` section defined where implementation
endpoints are tagged with `${tag}`.

```js
  "issuers": [{
    // ... issuer settings here
  }],
  "verifiers": [{
    // ... verifier settings here
  }],
  "${key}": [{
    "id": "..."
    "endpoint": "...",
    "tags": ["${tag}"]
  }]
```

## LICENSE

[BSD-3-Clause](LICENSE) Copyright 2022-2025 Digital Bazaar, Inc.
