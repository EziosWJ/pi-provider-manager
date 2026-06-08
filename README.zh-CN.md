# Pi Provider Manager

[English](README.md) | 简体中文 | [日本語](README.ja.md) | [한국어](README.ko.md) | [Español](README.es.md)

交互式 provider 和 model 管理器，用于 [pi coding agent](https://github.com/earendil-works/pi-mono)。

## 功能特性

✨ **交互式界面** - 所有操作都使用 pi 内置的选择/输入/确认对话框  
🔧 **Provider 管理** - 添加、列出、删除和测试自定义 provider  
📦 **模型管理** - 为每个 provider 添加、列出和删除模型  
🌐 **多 API 支持** - OpenAI Completions、Anthropic Messages、Google Generative AI  
🔒 **安全的 API 密钥** - 支持环境变量（推荐）并提供明文警告  
🛡️ **自动备份** - 修改前自动备份配置  
🏥 **健康检查** - 使用 `/provider doctor` 进行内置诊断  
⚡ **真实测试** - 实际连接测试，而非仅 URL 验证  
🎯 **高级配置** - 推理、兼容性、上下文窗口、成本设置

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
执行真实连接测试：
- 对于 OpenAI 兼容 API：测试 `/models` 端点
- 验证身份认证和响应
- 显示详细错误信息

#### `/provider doctor` - 运行诊断
检查配置健康状况：
- 验证 JSON 结构
- 检查环境变量
- 显示备份位置
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
# ✓ Connection successful
```

### 运行诊断

```bash
/provider doctor
# Running diagnostics...
# ✓ models.json is valid JSON
# ✓ Location: /home/user/.pi/agent/models.json
# ✓ Backup exists: /home/user/.pi/agent/models.json.backup
# 
# Providers: 1
# 
# • ollama
#   ✓ API key (OLLAMA_API_KEY) is set
#   Models: 2
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

## 许可证

MIT

## 相关链接

- [pi coding agent](https://github.com/earendil-works/pi-mono) - 主项目
- [pi 扩展文档](https://github.com/earendil-works/pi-mono/blob/main/packages/agent/docs/extensions.md)
