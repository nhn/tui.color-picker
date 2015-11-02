bundle:
	@gulp bundle

release:
	@gulp bundle --production

test:
	@gulp

.PHONY: bundle test
