# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
  - `cost` structure (input, output, cacheRead, cacheWrite)
  - `thinkingLevelMap` support
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
