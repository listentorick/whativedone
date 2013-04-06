test: 
	# $(call FixPath, NODE_MODULES)mocha -u tdd -R spec
	/node_modules/.bin/mocha -u tdd -R spec
.PHONY: test