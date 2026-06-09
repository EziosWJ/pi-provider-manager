# Pi Provider Manager

[English](README.md) | 简体中文 | [日本語](README.ja.md) | [한국어](README.ko.md) | [Español](README.es.md)

交互式 provider 和 model 管理器，用于 [pi coding agent](https://github.com/earendil-works/pi-mono)。

## 功能特性

✨ **交互式界面** - 所有操作都使用 pi 内置的选择/输入/确认对话框  
🔧 **Provider 管理** - 添加、列出、删除和测试自定义 provider  
📦 **模型管理** - 为每个 provider 添加、列出、删除和编辑模型  
🌐 **多 API 支持** - OpenAI Completions、Anthropic Messages、Google Generative AI  
🔒 **安全的 API 密钥** - 支持环境变量（推荐）并提供明文警告  
🛡️ **自动备份** - 带时间戳的备份和轮换（保留最近 10 个）  
🏥 **健康检查** - 使用 `/provider doctor` 进行内置诊断  
⚡ **真实测试** - 测试 `/models` 和 `/chat/completions` 两个端点  
🎯 **高级配置** - 推理、兼容性、上下文窗口设置  
🚀 **模型发现** - 使用 `/provider import-models` 从 provider 自动导入模型  
✏️ **编辑模型** - 使用 `/add-model edit` 修改已导入模型的配置  
🔍 **智能过滤** - 关键词过滤，处理大量模型列表  
⚡ **标签模式** - 快速 y/n/s 选择，用于模型导入

## 安装

### 自动安装（推荐）

```bash
curl -o ~/.pi/agent/extensions/provider-manager.ts \
  https://raw.githubusercontent.com/EziosWJ/pi-provider-manager/main/provider-manager.ts
```

### 手动安装

1. 下载 [provider-manager.ts](https://raw.githubusercontent.com/EziosWJ/pi-provider-manager/main/provider-manager.ts)
2. 放到 `~/.pi/agent/extensions/`（全局）或 `.pi/extensions/`（项目本地）
3. 重启 pi 或运行 `/reload`

## 使用方法

扩展会在启动 pi 时自动加载，你会看到通知：

```
Provider Manager: X custom provider(s) loaded
Use /provider or /add-model to manage configurations
```

### Provider 命令

#### `/provider add` - 添加新 provider
交互式提示：
- Provider 名称
- Base URL（如 `http://localhost:11434/v1`）
- API 类型（列表选择）
- **API Key 方法**（推荐使用环境变量，或直接输入）

**安全提示**：使用环境变量可以将 API 密钥保存在配置文件之外。

#### `/provider list` - 列出所有 provider
显示每个 provider 的名称、URL、API 类型、API 密钥状态（环境变量或掩码）和模型数量。

#### `/provider remove` - 删除 provider
从已配置的 provider 列表中选择，删除前需确认。配置会在删除前自动备份。

#### `/provider test` - 测试 provider 连接
执行全面连接测试：
- 测试 `/models` 端点（列出可用模型）
- 测试 `/chat/completions` 端点（实际对话能力）
- 验证身份认证和响应
- 显示详细的测试结果和错误信息

#### `/provider import-models` - 自动导入模型
从 provider 自动发现和导入模型：
- 从 `/models` 端点获取可用模型
- **关键词过滤**缩小大量模型列表范围
- **标签模式**（y/n/s）快速选择模型
- 三种导入模式："导入全部" / "标签模式" / "取消"
- 三种配置模式：
  - **使用默认值** - 快速导入，无需配置
  - **批量配置** - 为所有选定模型应用相同设置
  - **单独配置** - 分别配置每个模型

#### `/provider doctor` - 运行诊断
检查配置健康状况：
- 验证 JSON 结构
- 检查环境变量
- 显示带时间戳的备份历史（保留最近 10 个）
- 报告配置问题

### 模型命令

#### `/add-model add` - 添加模型到 provider
交互式提示：
- 选择 provider（从已配置列表中）
- 模型 ID（如 `gpt-4`、`llama3.1:8b`）
- 模型名称（可选的显示名称）
- **高级选项**（可选）：
  - 推理支持
  - 兼容性设置（developer role、reasoning_effort）
  - 上下文窗口大小
  - 最大输出 token 数

#### `/add-model list [provider]` - 列出模型
- 不带参数：列出所有 provider 的所有模型
- 带 provider 名称：只列出该 provider 的模型
- 显示指示器：`[reasoning]`、`[compat]`

#### `/add-model edit` - 编辑现有模型配置
用于修改模型设置的交互式编辑器：
- 选择 provider 和模型
- 显示当前配置
- 基于循环的编辑器，可修改多个设置：
  - 模型名称
  - 推理支持
  - 上下文窗口
  - 最大输出 token 数
  - 兼容性设置
- 可以清除可选字段

#### `/add-model remove` - 删除模型
交互式提示：
- 选择 provider
- 选择模型（从该 provider 中）
- 确认删除
- 配置会在删除前自动备份

## 使用示例

### 使用环境变量添加 Ollama Provider

```bash
pi
/provider add
# Name: ollama
# Base URL: http://localhost:11434/v1
# API type: OpenAI Completions
# API Key method: Environment Variable (Recommended)
# Environment variable name: OLLAMA_API_KEY

# 然后设置环境变量：
export OLLAMA_API_KEY=ollama
```

### 添加模型到 Ollama

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

### 测试 Provider 连接

```bash
/provider test
# Select provider: ollama
# Testing ollama...
# URL: http://localhost:11434/v1
# 
# Testing /models endpoint...
# ✓ Found 5 models
# 
# Testing /chat/completions endpoint...
# ✓ Chat completion successful
# 
# ✓ All tests passed
```

### 自动导入模型

```bash
/provider import-models
# Select provider to import models from: ollama
# Fetching models from ollama...
# Found 50 new model(s):
#   • llama3.1:8b
#   • llama3.2:1b
#   • qwen2.5-coder:7b
#   ... and 47 more
# 
# Filter by keyword (optional, press Enter to skip): llama
# Filtered from 50 to 8 model(s) matching "llama"
# 
# Found 8 new model(s):
#   • llama3.1:8b
#   • llama3.1:70b
#   • llama3.2:1b
#   ... and 5 more
# 
# Import mode:
#   → Import all
#   → Tag mode (y/n/s)
#   → Cancel
# 
# [Select: Tag mode]
# 
# Tag mode: y=yes (import), n=no (skip), s=skip remaining
# Press Enter after each choice
# 
# llama3.1:8b (1/8):
#   → y - Import this model
#   → n - Skip this model
#   → s - Skip remaining
# 
# [Select: y]
# 
# llama3.1:70b (2/8):
#   → y - Import this model
#   → n - Skip this model
#   → s - Skip remaining
# 
# [Select: n]
# 
# llama3.2:1b (3/8):
#   → y - Import this model
#   → n - Skip this model
#   → s - Skip remaining
# 
# [Select: s - skips remaining 6 models]
# 
# Configure 2 selected model(s):
#   → Use defaults (no config)
#   → Batch config (same for all)
#   → Individual config (one by one)
# 
# [Select: Batch config]
# Do these models support reasoning? No
# Context window (optional, e.g., 128000): 128000
# Max output tokens (optional, e.g., 4096): 4096
# ✓ Successfully imported 2 model(s) to provider "ollama"
```

### 编辑模型配置

```bash
/add-model edit
# Select provider: ollama
# Select model to edit: llama3.1:8b
# 
# Current configuration for "llama3.1:8b":
#   ID: llama3.1:8b
#   Name: Llama 3.1 8B
#   Reasoning: No
#   Context window: 128000
#   Max tokens: 4096
# 
# What to edit?
#   → Model name
#   → Reasoning support
#   → Context window
#   → Max output tokens
#   → Compatibility settings
#   → Done (save changes)
# 
# [Select: Context window]
# Context window (e.g., 128000, or empty to clear): 200000
# ✓ Context window: 200000
# 
# What to edit?
#   → Model name
#   → Reasoning support
#   → Context window
#   → Max output tokens
#   → Compatibility settings
#   → Done (save changes)
# 
# [Select: Done]
# ✓ Model "llama3.1:8b" updated successfully
```

### 运行诊断

```bash
/provider doctor
# Running diagnostics...
# ✓ models.json is valid JSON
# ✓ Location: /home/user/.pi/agent/models.json
# 
# Backup History (10 most recent):
# • models.json.backup.20260608_143022
# • models.json.backup.20260608_120515
# • models.json.backup.20260607_183044
# 
# Providers: 1
# 
# • ollama
#   ✓ API key (OLLAMA_API_KEY) is set
#   Models: 5
```

### 使用配置的模型

```bash
# 退出 pi（Ctrl+D），然后：
pi --provider ollama --model llama3.1:8b "你好！"
```

### 添加 Shell 别名

```bash
# 添加到 ~/.zshrc 或 ~/.bashrc
alias pi-llama='pi --provider ollama --model llama3.1:8b'
alias pi-qwen='pi --provider ollama --model qwen2.5-coder:7b'
```

## 配置文件

扩展会管理 `~/.pi/agent/models.json`。示例结构：

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
        { "id": "local-model", "name": "本地模型" }
      ]
    }
  }
}
```

## 支持的 API

- **`openai-completions`** - OpenAI 兼容端点（Ollama、LM Studio、vLLM 等）
- **`anthropic-messages`** - Anthropic Claude API
- **`google-generative-ai`** - Google Gemini API

## 故障排除

### 扩展未加载

检查扩展位置：
```bash
ls ~/.pi/agent/extensions/provider-manager.ts
```

手动重新加载：
```bash
pi -e ~/.pi/agent/extensions/provider-manager.ts
```

### 命令冲突

如果看到关于 `/model` 冲突的警告，这是正常的 - 扩展使用 `/add-model` 来避免冲突。

### 模型未显示

添加 provider 和模型后，重启 pi 或运行 `/reload` 来刷新配置。

## 常见使用场景

### 配置本地 Ollama

```bash
/provider add
# Name: ollama
# Base URL: http://localhost:11434/v1
# API type: OpenAI Completions
# API Key: ollama

/add-model add
# Provider: ollama
# Model ID: qwen2.5:7b
# Model Name: 通义千问 2.5 7B
```

### 配置 LM Studio

```bash
/provider add
# Name: lm-studio
# Base URL: http://localhost:1234/v1
# API type: OpenAI Completions
# API Key: lm-studio
```

### 配置远程 API 代理

```bash
/provider add
# Name: my-proxy
# Base URL: https://api.example.com/v1
# API type: OpenAI Completions
# API Key: sk-your-api-key

/add-model add
# Provider: my-proxy
# Model ID: gpt-4o
# Model Name: GPT-4o
```

## 贡献

欢迎在 [GitHub](https://github.com/EziosWJ/pi-provider-manager) 提交 Issue 和 Pull Request。

## 社区

💬 加入 [Linux.do 社区](https://linux.do) 讨论 - 友好的中文技术社区，讨论 Pi、AI 和开源技术。

## 许可证

MIT

## 相关链接

- [pi coding agent](https://github.com/earendil-works/pi-mono) - 主项目
- [pi 扩展文档](https://github.com/earendil-works/pi-mono/blob/main/packages/agent/docs/extensions.md)
