# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2026-06-09

### Added
- **`/add-model edit` command** - Edit existing model configurations
  - Interactive loop-based editor
  - Edit model name, reasoning support, context window, max tokens
  - Edit compatibility settings (developer role, reasoning effort)
  - Shows current configuration before editing
  - Can clear optional fields by entering empty values
- **Keyword filter for import-models**
  - Filter models by keyword before importing
  - Case-insensitive matching
  - Shows filtered count (e.g., "Filtered from 50 to 8 model(s)")
- **Tag mode for model selection** (`y/n/s`)
  - Fast single-letter selection: `y` (import), `n` (skip), `s` (skip remaining)
  - Shows progress counter (e.g., "1/50")
  - Clear instruction message at start
  - Similar to `git add -p` interaction pattern

### Changed
- **Improved import-models workflow**:
  - Import modes: "Import all" / "Tag mode (y/n/s)" / "Cancel"
  - Configuration modes: "Use defaults" / "Batch config" / "Individual config"
  - Replaced "Select one by one" with clearer tag mode
  - Individual config mode now configures each model separately
- Help text updated to include `/add-model edit`

### Improved
- Better user feedback during model selection
- Clearer option labels in tag mode
- More flexible configuration options

## [1.2.0] - 2026-06-09

### Added
- **Model auto-discovery**: `/provider import-models` command to automatically fetch and import models from OpenAI-compatible providers
  - Fetches available models from `/models` endpoint
  - Shows new models not yet imported
  - Supports batch import or selective import (up to 20 models)
  - Batch configuration for reasoning, context window, max tokens
- **Enhanced provider testing**: `/provider test` now performs comprehensive tests
  - Tests both `/models` and `/chat/completions` endpoints
  - Distinguishes between network errors, auth failures, and endpoint issues
  - Shows detailed test results with status indicators
- **Timestamped backups**: Backup files now include timestamps (e.g., `models.json.backup.2026-06-09-07-45-23`)
  - Keeps 10 most recent backups automatically
  - Stored in `~/.pi/agent/backups/` directory
  - `/provider doctor` shows backup history

### Changed
- Backup system: Changed from single `models.json.backup` to timestamped backups with rotation
- `/provider doctor` now displays timestamped backup history and location

### Removed
- Removed unimplemented fields from ModelConfig interface:
  - `cost` structure (input, output, cacheRead, cacheWrite)
  - `thinkingLevelMap`

### Fixed
- Configuration backup path references updated throughout

## [1.1.0] - 2026-06-09

### Added
- Environment variable support for API keys (recommended method)
- Real connection testing for providers (tests `/models` endpoint for OpenAI-compatible APIs)
- `/provider doctor` command for configuration diagnostics
- Automatic backup of models.json before changes
- Advanced model configuration options:
  - `reasoning` support flag
  - `compat` settings (supportsDeveloperRole, supportsReasoningEffort)
  - `contextWindow` configuration
  - `maxTokens` configuration
- Error recovery: failed config loads no longer overwrite existing configuration
- Better API key display (shows `$VAR (env)` for environment variables, `***` for plaintext)

### Changed
- API key input now defaults to environment variable method with warning for plaintext
- `loadConfig()` returns `null` on error instead of empty config (prevents accidental data loss)
- `/provider test` now performs real connectivity test instead of just URL validation
- Model listing shows `[reasoning]` and `[compat]` indicators

### Fixed
- Repository URLs in README files (wangjian → EziosWJ)
- Repository URLs in package.json
- Configuration file corruption recovery with backup system

### Security
- Recommend environment variables over plaintext API keys
- Warn users when storing API keys in plaintext
- Backup configuration before every write operation

## [1.0.0] - 2026-06-09

### Added
- Initial release
- Interactive provider management (add/list/remove/test)
- Interactive model management (add/list/remove)
- Support for OpenAI Completions, Anthropic Messages, Google Generative AI
- Auto-loading from `~/.pi/agent/extensions/`
- Multi-language documentation (EN, ZH, JA, KO, ES)
