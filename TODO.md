# TODO

## High Priority

- [ ] Add doxygen-style as comment option (next to standard, concise, detailed)
      Examples: https://doxygen.nl/examples.html
- [ ] Check if doxygen makes sense in verobity or function/inline context
- [ ] Support language-specific Doxygen: Java, C++, Python, JS/TS, Go
- [ ] Make sure to include tags: @brief, @param, @return, @throws
- [ ] Change comment options to make sense - remove function, default block
- [ ] Make sure you can change API keys after they expire/are revoked
- [ ] Add lang support for bash, C, x86, ARM asm
- [ ] Add demo screen recordings
- [ ] Add the ability to remove CodeLens (it could get annoying)
- [ ] Create more GIFs

### UI Improvements
- [ ] Add intuitive ways to change comment settings without editing `settings.json`
  - [ ] Add CodeLens above functions to quickly change comment style
  - [ ] Create dropdown menu for selecting comment verbosity
  - [ ] Add command palette options for changing settings
  - [ ] Quick-pick menu for model selection when generating comments
- [ ] Add keyboard shortcuts for different verbosity levels

### Testing & Error Handling
- [ ] Add test suite
  - [ ] Unit tests
  - [ ] Integration tests for model interactions
  - [ ] Test custom prompt configurations
  - [ ] Mock API responses (to avoid $$)
- [ ] Improve error handling
  - [ ] Better error messages for API failures
  - [ ] Handle rate limiting more gracefully
  - [ ] Add retry logic for failed requests
  - [ ] Validate settings before use

### Documentation
- [ ] Create GIFs for README
  - [x] Basic usage demo
  - [ ] Multiple language support
  - [ ] Settings configuration
- [ ] Add documentation for custom prompts
  - [ ] Example templates
  - [ ] Variable reference
  - [ ] Best practices

## Low Priority

- [ ] Add Google Gemini
- [ ] Add Amazon Nova (https://ndurner.github.io/amazon-nova)
- [ ] Add Llama
- [ ] Add Mixtral

### Feature Improvements
- [ ] Token management
  - [ ] Research optimal token limits for comments
  - [ ] Add configurable max_tokens setting
  - [ ] Add warning when approaching rate limits
- [ ] Language support
  - [ ] Add more language-specific comment styles
  - [ ] Improve language detection
  - [ ] Add file-level documentation support
- [ ] Performance improvements (*may not be worth it*)
  - [ ] Cache frequently used prompts
  - [ ] Optimize API requests
  - [ ] Reduce extension activation time
- [ ] UI polish
  - [ ] Add progress indicators
  - [ ] Improve status bar integration
  - [ ] Add icons to menus (?)

### Configuration
- [ ] Refine custom prompt interface
  - [ ] Add validation for custom prompts
  - [ ] Provide better template examples
  - [ ] Add prompt variables documentation
- [ ] Add more model options
  - [ ] Support new OpenAI models as released
  - [ ] Add configuration for API request parameters
  - [ ] Add model-specific prompt templates


### Additional Features
- [ ] Add support for batch commenting
- [ ] Add comment style preview
- [ ] Add comment edit history
- [ ] Add ability to save favorite prompts
- [ ] Add support for custom comment formatting
