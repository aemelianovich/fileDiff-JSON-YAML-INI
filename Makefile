install:
	npm install

lint:
	npx eslint .
	
lint-fix:
	npx eslint . --fix	

publish:
	npm publish --dry-run
