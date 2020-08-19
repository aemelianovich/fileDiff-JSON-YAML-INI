install:
	npm install

lint:
	npx eslint .
	
lint-fix:
	npx eslint . --fix	

publish:
	npm publish --dry-run

test:
	npm test

test-watch:
	npm test -- --watch

test-coverage:
	npm test -- --coverage --coverageProvider=v8

test-comparison:
	npm test -- __tests__/comparison.test.js
test-index:
	npm test -- __tests__/index.test.js	
.PHONY: test