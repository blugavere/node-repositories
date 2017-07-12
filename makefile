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