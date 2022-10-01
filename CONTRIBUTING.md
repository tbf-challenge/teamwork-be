# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue
with the owners of this repository before making a change.

Please note we have a code of conduct, please follow it in all your interactions with the project.

## How to contribute

So you want to write code and get it landed in the repository? Then first fork our repository into your own Github account, and create a local clone of it. The latter will be used to get new features implemented or bugs fixed. Once done and you have the code locally on the disk, you can get started. We advice to not work directly on the master branch, but to create a separate branch for each issue you are working on. That way you can easily switch between different work, and you can update each one for latest changes on upstream master individually. Check also [conventions](https://github.com/andela/bestpractices/wiki/Git-naming-conventions-and-best-practices) we are following for naming branches, etc.

## How to set up the project locally

Read the [README.md](README.md#getting-started) on how to set up the project locally.

## Submitting Patches

When you think the code is ready for review a pull request should be created on Github. When a pull request is created, ensure to fill all the information that applies on the [pull request template](.github/PULL_REQUEST_TEMPLATE.md). Owners of the repository will watch out for new PR‘s and review them in regular intervals. By default for each change in the PR we automatically run all the tests via Travis CI. If tests are failing make sure to address the failures immediately. Otherwise you can wait for a review. If comments have been given in a review, they have to get integrated. For those changes a separate commit should be created and pushed to your remote development branch. Don’t forget to add a comment in the PR afterward, so everyone gets notified by Github. Keep in mind that reviews can span multiple cycles until the owners are happy with the new code.

## Pull Request Process

1. Update the README.md if any change made affects project usage. This includes new environment
   variables.
2. Your pullrequest may merge by any of the maintainers once it has been reviewed and approved.

## Code of Conduct

Read the [code of conduct](CODE-OF-CONDUCT.md) for this project.
