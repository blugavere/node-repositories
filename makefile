.PHONY: test

clean:
	rm -rf coverage dist .nyc_output

test:
	npm test

reset:
	rm -rf node_modules

manual:
	mocha test **/*.test.js
