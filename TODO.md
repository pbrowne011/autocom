# TODO

## High Priority

- [x] Add doxygen-style as comment option (next to standard, concise, detailed)
      Examples: https://doxygen.nl/examples.html
- [ ] Fix commenting so that when the LLM provides irrelevant feedback and
      ignores user input, we can detect (and prevent in the first place)
- [ ] Add demo screen recordings
- [ ] Create more GIFs

### UI Improvements
- [ ] Add intuitive ways to change comment settings without editing `settings.json`
  - [ ] Create dropdown menu for selecting comment verbosity
  - [ ] Add command palette options for changing settings
  - [ ] Quick-pick menu for model selection when generating comments
- [ ] Add keyboard shortcuts for different verbosity levels

### Testing & Error Handling
- [ ] Add test suite
  - [ ] Unit tests (started)
  - [ ] Integration tests for model interactions
  - [ ] Test custom prompt configurations
  - [ ] Mock API responses (to avoid $$)

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
