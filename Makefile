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
test-stylish:
	npm test -- __tests__/stylish.test.js	
test-plain:
	npm test -- __tests__/plain.test.js
.PHONY: test