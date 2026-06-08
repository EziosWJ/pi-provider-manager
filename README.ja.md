# Pi Provider Manager

[English](README.md) | [简体中文](README.zh-CN.md) | 日本語 | [한국어](README.ko.md) | [Español](README.es.md)

[pi coding agent](https://github.com/earendil-works/pi-mono) 用のインタラクティブなプロバイダーとモデル管理ツール。

## 機能

✨ **インタラクティブUI** - すべての操作でpiの組み込み選択/入力/確認ダイアログを使用  
🔧 **プロバイダー管理** - カスタムプロバイダーの追加、リスト表示、削除、テスト  
📦 **モデル管理** - 各プロバイダーのモデルの追加、リスト表示、削除  
🌐 **マルチAPI対応** - OpenAI Completions、Anthropic Messages、Google Generative AI  
🔒 **安全なAPIキー** - 環境変数サポート（推奨）とプレーンテキスト警告  
🛡️ **自動バックアップ** - 変更前に設定を自動バックアップ  
🏥 **ヘルスチェック** - `/provider doctor`による組み込み診断  
⚡ **実際のテスト** - URL検証だけでなく実際の接続テスト  
🎯 **高度な設定** - 推論、互換性、コンテキストウィンドウ、コスト設定

## インストール

### 自動インストール（推奨）

```bash
curl -o ~/.pi/agent/extensions/provider-manager.ts \
  https://raw.githubusercontent.com/EziosWJ/pi-provider-manager/main/provider-manager.ts
```

### 手動インストール

1. [provider-manager.ts](https://raw.githubusercontent.com/EziosWJ/pi-provider-manager/main/provider-manager.ts)をダウンロード
2. `~/.pi/agent/extensions/`（グローバル）または`.pi/extensions/`（プロジェクトローカル）に配置
3. piを再起動するか`/reload`を実行

## 使用方法

拡張機能はpiの起動時に自動的にロードされます。次の通知が表示されます：

```
Provider Manager: X custom provider(s) loaded
Use /provider or /add-model to manage configurations
```

### プロバイダーコマンド

#### `/provider add` - 新しいプロバイダーを追加
対話的なプロンプト：
- プロバイダー名
- ベースURL（例：`http://localhost:11434/v1`）
- APIタイプ（リストから選択）
- **APIキーの方法**（環境変数推奨、または直接入力）

**セキュリティ注意**：環境変数を使用すると、APIキーが設定ファイルの外に保存されます。

#### `/provider list` - すべてのプロバイダーをリスト表示
各プロバイダーの名前、URL、APIタイプ、APIキーのステータス（環境変数またはマスク）、モデル数を表示します。

#### `/provider remove` - プロバイダーを削除
設定済みプロバイダーのリストから選択し、削除前に確認します。設定は削除前に自動的にバックアップされます。

#### `/provider test` - プロバイダー接続をテスト
実際の接続テストを実行：
- OpenAI互換APIの場合：`/models`エンドポイントをテスト
- 認証とレスポンスを検証
- 詳細なエラーメッセージを表示

#### `/provider doctor` - 診断を実行
設定のヘルスチェック：
- JSON構造を検証
- 環境変数を確認
- バックアップの場所を表示
- 設定の問題を報告

### モデルコマンド

#### `/add-model add` - プロバイダーにモデルを追加
対話的なプロンプト：
- プロバイダーを選択（設定済みリストから）
- モデルID（例：`gpt-4`、`llama3.1:8b`）
- モデル名（オプションの表示名）
- **高度なオプション**（オプション）：
  - 推論サポート
  - 互換性設定（developer role、reasoning_effort）
  - コンテキストウィンドウサイズ
  - 最大出力トークン数

#### `/add-model list [provider]` - モデルをリスト表示
- 引数なし：すべてのプロバイダーのすべてのモデルをリスト表示
- プロバイダー名あり：そのプロバイダーのモデルのみをリスト表示
- インジケーターを表示：`[reasoning]`、`[compat]`

#### `/add-model remove` - モデルを削除
対話的なプロンプト：
- プロバイダーを選択
- モデルを選択（そのプロバイダーから）
- 削除を確認
- 設定は削除前に自動的にバックアップされます

## 使用例

### 環境変数を使用してOllamaプロバイダーを追加

```bash
pi
/provider add
# Name: ollama
# Base URL: http://localhost:11434/v1
# API type: OpenAI Completions
# API Key method: Environment Variable (Recommended)
# Environment variable name: OLLAMA_API_KEY

# 次に環境変数を設定：
export OLLAMA_API_KEY=ollama
```

### Ollamaにモデルを追加

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

### プロバイダー接続をテスト

```bash
/provider test
# Select provider: ollama
# Testing ollama...
# URL: http://localhost:11434/v1
# ✓ Connection successful
```

### 診断を実行

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

### モデルを使用

```bash
# piを終了（Ctrl+D）してから：
pi --provider ollama --model llama3.1:8b "こんにちは！"
```

### シェルエイリアスを追加

```bash
# ~/.zshrcまたは~/.bashrcに追加
alias pi-llama='pi --provider ollama --model llama3.1:8b'
alias pi-qwen='pi --provider ollama --model qwen2.5-coder:7b'
```

## 設定ファイル

拡張機能は`~/.pi/agent/models.json`を管理します。例：

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
    }
  }
}
```

## サポートされているAPI

- **`openai-completions`** - OpenAI互換エンドポイント（Ollama、LM Studio、vLLMなど）
- **`anthropic-messages`** - Anthropic Claude API
- **`google-generative-ai`** - Google Gemini API

## トラブルシューティング

### 拡張機能がロードされない

拡張機能の場所を確認：
```bash
ls ~/.pi/agent/extensions/provider-manager.ts
```

手動でリロード：
```bash
pi -e ~/.pi/agent/extensions/provider-manager.ts
```

### コマンドの競合

`/model`の競合に関する警告が表示された場合、これは正常です - 拡張機能は代わりに`/add-model`を使用します。

### モデルが表示されない

プロバイダーとモデルを追加した後、piを再起動するか`/reload`を実行して設定を更新してください。

## コントリビュート

[GitHub](https://github.com/EziosWJ/pi-provider-manager)でIssueとPull Requestを歓迎します。

## ライセンス

MIT

## 関連リンク

- [pi coding agent](https://github.com/earendil-works/pi-mono) - メインプロジェクト
- [pi拡張機能ドキュメント](https://github.com/earendil-works/pi-mono/blob/main/packages/agent/docs/extensions.md)
