# autocom

[![VS Marketplace Version](https://shields.io/visual-studio-marketplace/v/pbrowne011.autocom?color=blue)](https://marketplace.visualstudio.com/items?itemName=pbrowne011.autocom)
[![VS Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/pbrowne011.autocom?color=darkgreen)](https://marketplace.visualstudio.com/items?itemName=pbrowne011.autocom)
[![VS Marketplace Rating](https://img.shields.io/visual-studio-marketplace/r/pbrowne011.autocom)](https://marketplace.visualstudio.com/items?itemName=pbrowne011.autocom)

Autocom is a VS Code extension that automatically comments your code using
generative AI models such as GPT-4 and Claude Sonnet 3.5.

<p align="center">
  <img src="img/demo-overview.gif" alt="Overview of autocom in action" width="600"/>
</p>

## Installation

Install autocom from
[the VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=pbrowne011.autocom)
or by searching for "autocom" in the VS Code extensions panel (`Ctrl-Shift-X`).

## Usage

To use, highlight the code you want to comment and press `Ctrl-Alt-C` to create
a comment above using OpenAI's models. Alternatively, press `Ctrl-Alt-G` to
create a comment using Anthropic's models.

<insert diff comment gif>

A popup also appears when you highlight code, or you can right click your code
selection to comment.

<insert highlight gif>

<insert right click gif>

The first time you use each model, you will be prompted for an API key, which
is stored securely by your OS. 
- [Get OpenAI API key](https://platform.openai.com/account/api-keys)
- [Get Anthropic API key](https://console.anthropic.com/settings/keys)

## Features

- **One-click comment generation** for functions, classes, and code blocks
- **Multiple AI models** supported:
  - Anthropic: `claude-3-sonnet` (default), `claude-3-opus`, `claude-3-haiku`
  - OpenAI: `gpt-4-turbo` (default), `gpt-4`, `gpt-3.5-turbo`
- **Smart language detection** and appropriate comment styling
- **Support for 10+ languages** including C++, Python, JavaScript, Java, Go,
  and Rust,
- **Default keyboard shortcuts** for convenient use

<insert two diff langs gifs>

## Configuration

Configure through VS Code settings (File > Preferences > Settings > Extensions > Autocom):

```jsonc
{
    // Choose AI models
    "autocom.openaiModel": "gpt-4-turbo",        // "gpt-4", "gpt-3.5-turbo"
    "autocom.anthropicModel": "claude-3-sonnet", // "claude-3-opus", "claude-3-haiku"
    
    // Comment style
    "autocom.commentVerbosity": "standard",     // "concise" or "detailed"
    
    // Optional: Custom prompt templates
    "autocom.customPrompts": {
        "function": {
            "standard": "Generate a comment explaining what this function does..."
        }
    }
}
```

The `customPrompts` setting allows you to override default prompts for different
comment types and verbosity levels. See documentation for template variables
and examples. (TODO: add this documentation)

## Known Issues

- Does not work with WSL or remote connections
- Does not allow inline commments, only block comments at the top of a
  block of code

## License

GPL 3.0

## Development

```
# Working on features
git commit -m "add block comment tests"
git push

# Ready for new version
npm version patch  # Updates version in package.json
git push
git push --tags    # This triggers the CI/CD pipeline
```
