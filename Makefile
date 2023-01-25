-include .env
export

.PHONY: help test

IMAGE_NAME=ui-f1-registry
LATEST_COMMIT_HASH=$(shell git rev-parse --short HEAD)
ZIP_PATH=./out/$(IMAGE_NAME)-$(LATEST_COMMIT_HASH).zip

LATEST_TAG=$(shell gh api /repos/no10ds/rapid-ui/releases/latest | jq -r ".tag_name")
ifeq ($(LATEST_TAG), null)
	TAG_NAME="$(IMAGE_NAME)-$(LATEST_COMMIT_HASH)"
else
	TAG_NAME="$(LATEST_TAG)-dev"
endif

help:	## List targets and description
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

# Deployment -------------------------
##
zip-contents:		## Zip contents of the built static html files
ifdef tag
	@zip -r "${tag}.zip" ./out
else
	@zip -r $(ZIP_PATH) ./out
endif

upload-to-release:	## Upload the zipped built static files to a Github draft release
	@gh release create [] $(ZIP_PATH) --draft --title "$(TAG_NAME)" --notes "" 

upload-to-release-prod:	## Upload the zipped built static files to a production Github release
	@gh release upload ${tag} "${tag}.zip" --clobber

create-static-out: 	## Manually create the static files
	@npm run build:static

# Release -------------------------
##
release:
	@git checkout ${commit}
	@git tag -a "${version}" -m "Release tag for version ${version}"
	@git checkout -
	@git push origin ${version}
	@node ./generate_latest_changelog.js
	@gh release create ${version} -F latest_release_changelog.md
	@rm -rf latest_release_changelog.md

zip-and-release-ui:
	@$(MAKE) zip-contents
	@$(MAKE) upload-to-release

# Setup and config -------------------------
##
npm-setup:	## Setup project
	@npm i -g next
	@npm ci
	@npm run prepare

# Running -------------------------
##
dev:	## Run development server
	@npm run dev

test:	## Run all UI tests
	@npm run test:all
