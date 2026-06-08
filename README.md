# Pi Provider Manager

Interactive provider and model manager for [pi coding agent](https://github.com/earendil-works/pi-mono).

## Features

✨ **Interactive UI** - All operations use pi's built-in select/input/confirm dialogs  
🔧 **Provider Management** - Add, list, remove, and test custom providers  
📦 **Model Management** - Add, list, and remove models for each provider  
🌐 **Multi-API Support** - OpenAI Completions, Anthropic Messages, Google Generative AI

## Installation

### Automatic (Recommended)

```bash
curl -o ~/.pi/agent/extensions/provider-manager.ts \
  https://raw.githubusercontent.com/wangjian/pi-provider-manager/main/provider-manager.ts
```

### Manual

1. Download [provider-manager.ts](https://raw.githubusercontent.com/wangjian/pi-provider-manager/main/provider-manager.ts)
2. Place it in `~/.pi/agent/extensions/` (global) or `.pi/extensions/` (project-local)
3. Restart pi or run `/reload`

## Usage

The extension automatically loads when you start pi. You'll see a notification:

```
Provider Manager: X custom provider(s) loaded
Use /provider or /add-model to manage configurations
```

### Provider Commands

#### `/provider add` - Add a new provider
Interactive prompts:
- Provider name
- Base URL (e.g., `http://localhost:11434/v1`)
- API type (select from list)
- API Key

#### `/provider list` - List all providers
Shows name, URL, API type, and model count for each provider.

#### `/provider remove` - Remove a provider
Select from list of configured providers, confirms before deletion.

#### `/provider test <name>` - Test provider URL
Validates the provider's base URL.

### Model Commands

#### `/add-model add` - Add a model to a provider
Interactive prompts:
- Select provider (from configured list)
- Model ID (e.g., `gpt-4`, `llama3.1:8b`)
- Model name (optional display name)

#### `/add-model list [provider]` - List models
- Without argument: lists all models from all providers
- With provider name: lists models for that provider only

#### `/add-model remove` - Remove a model
Interactive prompts:
- Select provider
- Select model (from that provider)
- Confirm deletion

## Examples

### Add Ollama Provider

```bash
pi
/provider add
# Name: ollama
# Base URL: http://localhost:11434/v1
# API type: OpenAI Completions
# API Key: ollama
```

### Add Models to Ollama

```bash
/add-model add
# Select provider: ollama
# Model ID: llama3.1:8b
# Model Name: Llama 3.1 8B

/add-model add
# Select provider: ollama
# Model ID: qwen2.5-coder:7b
# Model Name: Qwen 2.5 Coder 7B
```

### Use the Models

```bash
# Exit pi (Ctrl+D), then:
pi --provider ollama --model llama3.1:8b "Hello!"
```

### Add Shell Aliases

```bash
# Add to ~/.zshrc or ~/.bashrc
alias pi-llama='pi --provider ollama --model llama3.1:8b'
alias pi-qwen='pi --provider ollama --model qwen2.5-coder:7b'
```

## Configuration File

The extension manages `~/.pi/agent/models.json`. Example structure:

```json
{
  "providers": {
    "ollama": {
      "baseUrl": "http://localhost:11434/v1",
      "api": "openai-completions",
      "apiKey": "ollama",
      "models": [
        { "id": "llama3.1:8b", "name": "Llama 3.1 8B" },
        { "id": "qwen2.5-coder:7b", "name": "Qwen 2.5 Coder 7B" }
      ]
    },
    "lm-studio": {
      "baseUrl": "http://localhost:1234/v1",
      "api": "openai-completions",
      "apiKey": "lm-studio",
      "models": [
        { "id": "local-model", "name": "Local Model" }
      ]
    }
  }
}
```

## Supported APIs

- **`openai-completions`** - OpenAI-compatible endpoints (Ollama, LM Studio, vLLM, etc.)
- **`anthropic-messages`** - Anthropic Claude API
- **`google-generative-ai`** - Google Gemini API

## Troubleshooting

### Extension not loading

Check extension location:
```bash
ls ~/.pi/agent/extensions/provider-manager.ts
```

Reload manually:
```bash
pi -e ~/.pi/agent/extensions/provider-manager.ts
```

### Command conflicts

If you see warnings about `/model` conflicts, this is normal - the extension uses `/add-model` instead.

### Models not appearing

After adding providers and models, restart pi or run `/reload` to refresh the configuration.

## Contributing

Issues and pull requests welcome at [GitHub](https://github.com/wangjian/pi-provider-manager).

## License

MIT

## Related

- [pi coding agent](https://github.com/earendil-works/pi-mono) - The main project
- [pi extensions docs](https://github.com/earendil-works/pi-mono/blob/main/packages/agent/docs/extensions.md)
