.PHONY: test bootstrap clean dist coverage .nyc_output

export NODE_ENV = test
export FORCE_COLOR = true

clean:
	rm -rf coverage dist .nyc_output

pretest:
	tsc test/*.ts --module commonjs --sourcemap
posttest: 
	nyc report --reporter=json && codecov -f coverage/*.json

test:	clean bootstrap
	# make lint
	# make install
	# NODE_PATH=./packages ./node_modules/.bin/nyc ./node_modules/.bin/mocha \packages/*/lib/\**/*.test.js \packages/*/test \packages/*/\*.test.js test \src/\**/*.test.js
	# lerna run test
	./node_modules/.bin/nyc ./node_modules/.bin/_mocha --opts .mocharc

reset:
	rm -rf node_modules

manual:
	mocha test **/*.test.js

install:
	node scripts/install

lint:
	./node_modules/.bin/eslint src test packages/*/src packages/*/src packages/*/test packages/*/*.js

coverage:
	./node_modules/.bin/nyc report --reporter=json && codecov -f coverage/*.json
	./node_modules/.bin/nyc report --reporter=text-lcov | coveralls

t:
	(cd ./packages/$(filter-out $@,$(MAKECMDGOALS))-repository; NODE_ENV=test npm test;)

l:
	(cd ./packages/$(filter-out $@,$(MAKECMDGOALS))-repository; npm link;)
	npm link @repositories/$(filter-out $@,$(MAKECMDGOALS))

p:
	make t $(filter-out $@,$(MAKECMDGOALS))
	(cd ./packages/$(filter-out $@,$(MAKECMDGOALS))-repository; npm publish --access public;)

%:
	@:


bootstrap:
	lerna bootstrap

