# fh-forms

FeedHenry Cloud API for form submissions.

## Test execution

There are two types of test: unit tests that don't have any additional dependencies and acceptance tests that require configured MongoDB. [Turbo](https://www.npmjs.com/package/turbo-test-runner) is used as a test runner. It stops test execution if a test fails.

We use `make` to run the tests. Specification is stored in the *makefile*.

```
make test // run all tests with jshint 
```
```
make test_unit // run all unit tests
```
```
make test_accept // run all acceptance tests
```

## Code coverage

Code coverage reports are generated using [istanbul](http://gotwarlost.github.io/istanbul/) and stored in *coverage*, *cov-unit* and *cov-accept* folders.

```
make coverage // generates all code coverage reports
```

Use 'test_unit_cov' or 'test_accept_cov' instead of 'coverage' to generate individual reports.

## Source analysis

Source analysis can be generated with [plato](https://www.npmjs.com/package/plato). Generated 
reports are available at *plato/index.html*.

```
make plato
```


