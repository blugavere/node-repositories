.PHONY: test

clean:
	rm -rf coverage dist .nyc_output

	#  

test:	clean
	# make lint
	# make install
	./node_modules/.bin/nyc ./node_modules/.bin/mocha \packages/*/lib/\**/*.test.js \packages/*/test \packages/*/\*.test.js test \src/\**/*.test.js

reset:
	rm -rf node_modules

manual:
	mocha test **/*.test.js

install:
	node scripts/install

lint:
	./node_modules/.bin/eslint src test packages/*/src packages/*/src packages/*/test packages/*/*.js

coverage:
	./node_modules/.bin/nyc report --reporter=text-lcov | coveralls
