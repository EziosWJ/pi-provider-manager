# Pi Provider Manager

[English](README.md) | [简体中文](README.zh-CN.md) | 日本語 | [한국어](README.ko.md) | [Español](README.es.md)

[pi coding agent](https://github.com/earendil-works/pi-mono) 用のインタラクティブなプロバイダーとモデル管理ツール。

## 機能

✨ **インタラクティブUI** - すべての操作でpiの組み込み選択/入力/確認ダイアログを使用  
🔧 **プロバイダー管理** - カスタムプロバイダーの追加、リスト表示、削除、テスト  
📦 **モデル管理** - 各プロバイダーのモデルの追加、リスト表示、削除  
🌐 **マルチAPI対応** - OpenAI Completions、Anthropic Messages、Google Generative AI

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
- APIキー

#### `/provider list` - すべてのプロバイダーをリスト表示
各プロバイダーの名前、URL、APIタイプ、モデル数を表示します。

#### `/provider remove` - プロバイダーを削除
設定済みプロバイダーのリストから選択し、削除前に確認します。

#### `/provider test <name>` - プロバイダーのURLをテスト
プロバイダーのベースURLを検証します。

### モデルコマンド

#### `/add-model add` - プロバイダーにモデルを追加
対話的なプロンプト：
- プロバイダーを選択（設定済みリストから）
- モデルID（例：`gpt-4`、`llama3.1:8b`）
- モデル名（オプションの表示名）

#### `/add-model list [provider]` - モデルをリスト表示
- 引数なし：すべてのプロバイダーのすべてのモデルをリスト表示
- プロバイダー名あり：そのプロバイダーのモデルのみをリスト表示

#### `/add-model remove` - モデルを削除
対話的なプロンプト：
- プロバイダーを選択
- モデルを選択（そのプロバイダーから）
- 削除を確認

## 使用例

### Ollamaプロバイダーを追加

```bash
pi
/provider add
# Name: ollama
# Base URL: http://localhost:11434/v1
# API type: OpenAI Completions
# API Key: ollama
```

### Ollamaにモデルを追加

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
