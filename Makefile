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
.PHONY: test