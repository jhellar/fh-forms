PACKAGE = fh-forms
#
# Note: Get the Major/Release/Hotfix numbers from package.json.
# TODO: should really try use a JSON command line tool to do this,
# this could easily be done in Node but would introduce an additional
# build dependency.. 
#
PKG_VER:=$(shell grep version package.json| sed s/\"//g| sed s/version://g| sed s/-BUILD-NUMBER//g| tr -d ' '| tr -d ',') 
MAJOR:=$(shell echo $(PKG_VER)| cut -d '.' -f1)
RELEASE:=$(shell echo $(PKG_VER)| cut -d '.' -f2)
HOTFIX:=$(shell echo $(PKG_VER)| cut -d '.' -f3)

BUILD_NUMBER ?= DEV-VERSION
VERSION = $(MAJOR).$(RELEASE).$(HOTFIX)
DIST_DIR  = ./dist
OUTPUT_DIR  = ./output
MODULES = ./node_modules
COV_DIR = ./lib-cov
PLATO_DIR = ./plato
RELEASE_FILE = $(PACKAGE)-$(VERSION)-$(BUILD_NUMBER).tar.gz
RELEASE_DIR = $(PACKAGE)-$(VERSION)-$(BUILD_NUMBER)

all: clean npm_deps jshint test plato

test: jshint test_unit_cov test_accept_cov

test_accept: npm_deps
	mongo ./test/setup_mongo.js
	env NODE_PATH=./lib ./node_modules/.bin/turbo --setUp ./test/setup.js --tearDown ./test/setup.js ./test/accept/ --series=true

test_unit: npm_deps
	env NODE_PATH=./lib ./node_modules/.bin/turbo ./test/unit/ --series=true

test_unit_cov: npm_deps
	env NODE_PATH=./lib ./node_modules/.bin/istanbul cover --dir cov-unit ./node_modules/.bin/turbo -- ./test/unit

test_accept_cov: npm_deps
	mongo ./test/setup_mongo.js
	env NODE_PATH=./lib ./node_modules/.bin/istanbul cover --dir cov-accept ./node_modules/.bin/turbo -- --setUp ./test/setup.js --tearDown ./test/setup.js ./test/accept --series=true

coverage: test_unit_cov test_accept_cov
	rm -rf coverage
	./node_modules/.bin/istanbul report
	./node_modules/.bin/istanbul report --report cobertura
	@echo "See html coverage at: `pwd`/coverage/lcov-report/index.html"

npm_deps: 
	npm install .

jshint: npm_deps
	./node_modules/.bin/jshint lib/*.js lib/**/*.js

plato:
	./node_modules/.bin/plato -r -d plato -l .jshintrc lib
	@echo Open the Plato report in `pwd`/plato/index.html 

# Uses grunt to combine forms-rules-engine with async inside closure, for use in apps
client_rules_engine:
	./node_modules/.bin/grunt

dist: npm_deps client_rules_engine
	rm -rf $(DIST_DIR) $(OUTPUT_DIR)
	rm -rf $(MODULES)/whiskey
	mkdir -p $(DIST_DIR) $(OUTPUT_DIR)/$(RELEASE_DIR)
	cp -r ./lib $(OUTPUT_DIR)/$(RELEASE_DIR)
	cp ./package.json $(OUTPUT_DIR)/$(RELEASE_DIR)
	cp ./README.md $(OUTPUT_DIR)/$(RELEASE_DIR)
	echo "$(MAJOR).$(RELEASE).$(HOTFIX)-$(BUILD_NUMBER)" > $(OUTPUT_DIR)/$(RELEASE_DIR)/VERSION.txt
	sed -i -e s/BUILD-NUMBER/$(BUILD_NUMBER)/ $(OUTPUT_DIR)/$(RELEASE_DIR)/package.json
	tar -czf $(DIST_DIR)/$(RELEASE_FILE) -C $(OUTPUT_DIR) $(RELEASE_DIR)
	cp  ./client/output/rulesengine.js $(DIST_DIR)
	cp  ./client/output/cssGenerator.js $(DIST_DIR)

clean:
	rm -rf $(DIST_DIR) $(OUTPUT_DIR) $(MODULES) $(COV_DIR) $(PLATO_DIR)

.PHONY: test dist clean npm_deps client_rules_engine
