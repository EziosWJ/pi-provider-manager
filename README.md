# Pi Provider Manager

English | [简体中文](README.zh-CN.md) | [日本語](README.ja.md) | [한국어](README.ko.md) | [Español](README.es.md)

Interactive provider and model manager for [pi coding agent](https://github.com/earendil-works/pi-mono).

## Features

✨ **Interactive UI** - All operations use pi's built-in select/input/confirm dialogs  
🔧 **Provider Management** - Add, list, remove, and test custom providers  
📦 **Model Management** - Add, list, and remove models for each provider  
🌐 **Multi-API Support** - OpenAI Completions, Anthropic Messages, Google Generative AI  
🔒 **Secure API Keys** - Environment variable support (recommended) with plaintext warnings  
🛡️ **Auto Backup** - Timestamped backups with rotation (keeps 10 most recent)  
🏥 **Health Check** - Built-in diagnostics with `/provider doctor`  
⚡ **Real Testing** - Tests both `/models` and `/chat/completions` endpoints  
🎯 **Advanced Config** - Reasoning, compat, context window settings  
🚀 **Model Discovery** - Auto-import models from providers with `/provider import-models`

## Installation

### Automatic (Recommended)

```bash
curl -o ~/.pi/agent/extensions/provider-manager.ts \
  https://raw.githubusercontent.com/EziosWJ/pi-provider-manager/main/provider-manager.ts
```

### Manual

1. Download [provider-manager.ts](https://raw.githubusercontent.com/EziosWJ/pi-provider-manager/main/provider-manager.ts)
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
- **API Key method** (Environment Variable recommended, or Direct Input)

**Security Note**: Using environment variables keeps your API keys out of the configuration file.

#### `/provider list` - List all providers
Shows name, URL, API type, API key status (env or masked), and model count for each provider.

#### `/provider remove` - Remove a provider
Select from list of configured providers, confirms before deletion. Configuration is automatically backed up before removal.

#### `/provider test` - Test provider connection
Performs comprehensive connectivity tests:
- For OpenAI-compatible APIs: Tests both `/models` and `/chat/completions` endpoints
- Validates authentication and response
- Distinguishes between network errors, auth failures, and endpoint issues
- Shows detailed test results with status indicators

#### `/provider doctor` - Run diagnostics
Health check for your configuration:
- Validates JSON structure
- Checks environment variables
- Shows timestamped backup history (keeps 10 most recent)
- Reports configuration issues

#### `/provider import-models` - Auto-discover and import models
Automatically fetch and import models from OpenAI-compatible providers:
- Fetches available models from `/models` endpoint
- Shows new models not yet imported
- Supports batch import or selective import
- Batch configuration for reasoning, context window, max tokens

### Model Commands

#### `/add-model add` - Add a model to a provider
Interactive prompts:
- Select provider (from configured list)
- Model ID (e.g., `gpt-4`, `llama3.1:8b`)
- Model name (optional display name)
- **Advanced options** (optional):
  - Reasoning support
  - Compatibility settings (developer role, reasoning_effort)
  - Context window size
  - Max output tokens

#### `/add-model list [provider]` - List models
- Without argument: lists all models from all providers
- With provider name: lists models for that provider only
- Shows indicators: `[reasoning]`, `[compat]`

#### `/add-model remove` - Remove a model
Interactive prompts:
- Select provider
- Select model (from that provider)
- Confirm deletion
- Configuration is automatically backed up before removal

## Examples

### Add Ollama Provider with Environment Variable

```bash
pi
/provider add
# Name: ollama
# Base URL: http://localhost:11434/v1
# API type: OpenAI Completions
# API Key method: Environment Variable (Recommended)
# Environment variable name: OLLAMA_API_KEY

# Then set the environment variable:
export OLLAMA_API_KEY=ollama
```

### Add Models to Ollama

```bash
/add-model add
# Select provider: ollama
# Model ID: llama3.1:8b
# Model Name: Llama 3.1 8B
# Configure advanced options? No

/add-model add
# Select provider: ollama
# Model ID: qwen2.5-coder:7b
# Model Name: Qwen 2.5 Coder 7B
# Configure advanced options? Yes
# Does this model support reasoning? Yes
# ...
```

### Test Provider Connection

```bash
/provider test
# Select provider: ollama
# Testing ollama...
# URL: http://localhost:11434/v1
# ✓ All tests passed
# 
# ✓ /models endpoint: OK
# ✓ /chat/completions: Endpoint available (test model not found)
```

### Auto-Import Models

```bash
/provider import-models
# Select provider to import models from: ollama
# Fetching models from ollama...
# Found 15 new model(s):
# 
#   • llama3.1:8b
#   • qwen2.5-coder:7b
#   • deepseek-coder:6.7b
#   ... and 12 more
# 
# Import all 15 model(s)? Yes
# Apply default configuration to all imported models? Yes
# Do these models support reasoning? No
# Context window (optional, e.g., 128000): 32768
# Max output tokens (optional, e.g., 4096): 4096
# ✓ Successfully imported 15 model(s) to provider "ollama"
```

### Run Diagnostics

```bash
/provider doctor
# Running diagnostics...
# ✓ models.json is valid JSON
# ✓ Location: /home/user/.pi/agent/models.json
# ✓ Backups: 5 (keeping 10 most recent)
#   Latest: models.json.backup.2026-06-09-07-45-23
#   Location: /home/user/.pi/agent/backups
# 
# Providers: 1
# 
# • ollama
#   ✓ API key (OLLAMA_API_KEY) is set
#   Models: 17
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

Issues and pull requests welcome at [GitHub](https://github.com/EziosWJ/pi-provider-manager).

## License

MIT

## Related

- [pi coding agent](https://github.com/earendil-works/pi-mono) - The main project
- [pi extensions docs](https://github.com/earendil-works/pi-mono/blob/main/packages/agent/docs/extensions.md)
