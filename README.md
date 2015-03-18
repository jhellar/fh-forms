# fh-forms

FeedHenry Cloud API for form submissions.

## Tests

Tests are run using [Turbo test runner](https://www.npmjs.com/package/turbo-test-runner) which stops execution on first failed test.

### Test execution

There are two types of test. Unit tests that don't have any additional dependencies and acceptance tests that require configured MongoDB. We use `make` to run the tests. Specification is stored in the *makefile*.

```
make test // run all tests and jshint 
```
```
make test_unit // run all unit tests
```
```
make test_accept // run all acceptance tests
```

### Code coverage

Code coverage reports are generated using [istanbul](http://gotwarlost.github.io/istanbul/) and stored in *coverage*, *cov-unit* and *cov-accept* folders.

```
make coverage // generates all code coverage reports
```

