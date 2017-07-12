.PHONY: test

clean:
	rm -rf coverage dist .nyc_output

test:
	npm test

reset:
	rm -rf node_modules

manual:
	mocha test **/*.test.js

install:
	node scripts/install

lint:
	./node_modules/.bin/eslint lib test packages/*/src packages/*/lib packages/*/test packages/*/*.js

coverage:
	./node_modules/.bin/nyc report --reporter=text-lcov | coveralls

test: clean
	make lint
	make install
	./node_modules/.bin/nyc ./node_modules/.bin/mocha