# Change Log

All notable changes to the "autocom" extension will be documented in this file.

This changelog documents minor and major releases, as well as the most recent
patch releases since the previous patch.

<!--## [Unreleased] -->

## [0.1.2]

- Fixed `wrapLine` function to preserve leading whitespace and remove all
  trailing and subsequent leading whitespace
- Fixed testing configuration files to allow for adding tests
- Added 8 unit tests for `wrapLine` function

## [0.1.1]

- Fixed formatting for languages (Bash, assembly variants) where there is no
  support for multi-line commenting
- Added comment styles for the following languages: ARM assembly, x86 assembly,
  C, Bash, Bourne shell, Z shell, HTML, and CSS

## [0.1.0]

- Added support for Anthropic and OpenAI models
- Added Doxygen commenting style
- Added other user preference settings including whether to enable CodeLens
  popups, how detailed comments should be, and custom prompts
- Added comment styles for several languages, including C++, Python, Java,
  JavaScript, Go, and others
- Fixed continuous integration / continuous deployment (CI/CD) pipeline for
  releasing new versions
- Fixed API error handling for different status codes, as well as when API keys
  expire or are revoked
- Fixed the `activate()` function so that the extension actually works when used
  on another device