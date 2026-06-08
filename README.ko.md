# Pi Provider Manager

[English](README.md) | [简体中文](README.zh-CN.md) | [日本語](README.ja.md) | 한국어 | [Español](README.es.md)

[pi coding agent](https://github.com/earendil-works/pi-mono)를 위한 대화형 프로바이더 및 모델 관리 도구입니다.

## 기능

✨ **대화형 UI** - 모든 작업에서 pi의 내장 선택/입력/확인 대화상자 사용  
🔧 **프로바이더 관리** - 사용자 정의 프로바이더 추가, 나열, 제거, 테스트  
📦 **모델 관리** - 각 프로바이더의 모델 추가, 나열, 제거  
🌐 **다중 API 지원** - OpenAI Completions, Anthropic Messages, Google Generative AI

## 설치

### 자동 설치 (권장)

```bash
curl -o ~/.pi/agent/extensions/provider-manager.ts \
  https://raw.githubusercontent.com/EziosWJ/pi-provider-manager/main/provider-manager.ts
```

### 수동 설치

1. [provider-manager.ts](https://raw.githubusercontent.com/EziosWJ/pi-provider-manager/main/provider-manager.ts) 다운로드
2. `~/.pi/agent/extensions/` (전역) 또는 `.pi/extensions/` (프로젝트 로컬)에 배치
3. pi를 재시작하거나 `/reload` 실행

## 사용법

확장 프로그램은 pi 시작 시 자동으로 로드됩니다. 다음 알림이 표시됩니다:

```
Provider Manager: X custom provider(s) loaded
Use /provider or /add-model to manage configurations
```

### 프로바이더 명령

#### `/provider add` - 새 프로바이더 추가
대화형 프롬프트:
- 프로바이더 이름
- 베이스 URL (예: `http://localhost:11434/v1`)
- API 유형 (목록에서 선택)
- API 키

#### `/provider list` - 모든 프로바이더 나열
각 프로바이더의 이름, URL, API 유형, 모델 수를 표시합니다.

#### `/provider remove` - 프로바이더 제거
구성된 프로바이더 목록에서 선택하고 삭제 전 확인합니다.

#### `/provider test <name>` - 프로바이더 URL 테스트
프로바이더의 베이스 URL을 검증합니다.

### 모델 명령

#### `/add-model add` - 프로바이더에 모델 추가
대화형 프롬프트:
- 프로바이더 선택 (구성된 목록에서)
- 모델 ID (예: `gpt-4`, `llama3.1:8b`)
- 모델 이름 (선택적 표시 이름)

#### `/add-model list [provider]` - 모델 나열
- 인수 없음: 모든 프로바이더의 모든 모델 나열
- 프로바이더 이름 포함: 해당 프로바이더의 모델만 나열

#### `/add-model remove` - 모델 제거
대화형 프롬프트:
- 프로바이더 선택
- 모델 선택 (해당 프로바이더에서)
- 삭제 확인

## 사용 예시

### Ollama 프로바이더 추가

```bash
pi
/provider add
# Name: ollama
# Base URL: http://localhost:11434/v1
# API type: OpenAI Completions
# API Key: ollama
```

### Ollama에 모델 추가

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

### 모델 사용

```bash
# pi 종료 (Ctrl+D) 후:
pi --provider ollama --model llama3.1:8b "안녕하세요!"
```

### 셸 별칭 추가

```bash
# ~/.zshrc 또는 ~/.bashrc에 추가
alias pi-llama='pi --provider ollama --model llama3.1:8b'
alias pi-qwen='pi --provider ollama --model qwen2.5-coder:7b'
```

## 설정 파일

확장 프로그램은 `~/.pi/agent/models.json`을 관리합니다. 예시:

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

## 지원되는 API

- **`openai-completions`** - OpenAI 호환 엔드포인트 (Ollama, LM Studio, vLLM 등)
- **`anthropic-messages`** - Anthropic Claude API
- **`google-generative-ai`** - Google Gemini API

## 문제 해결

### 확장 프로그램이 로드되지 않음

확장 프로그램 위치 확인:
```bash
ls ~/.pi/agent/extensions/provider-manager.ts
```

수동으로 다시 로드:
```bash
pi -e ~/.pi/agent/extensions/provider-manager.ts
```

### 명령 충돌

`/model` 충돌에 대한 경고가 표시되면 정상입니다 - 확장 프로그램은 대신 `/add-model`을 사용합니다.

### 모델이 표시되지 않음

프로바이더와 모델을 추가한 후 pi를 재시작하거나 `/reload`를 실행하여 설정을 새로 고치세요.

## 기여하기

[GitHub](https://github.com/EziosWJ/pi-provider-manager)에서 이슈 및 풀 리퀘스트를 환영합니다.

## 라이선스

MIT

## 관련 링크

- [pi coding agent](https://github.com/earendil-works/pi-mono) - 메인 프로젝트
- [pi 확장 문서](https://github.com/earendil-works/pi-mono/blob/main/packages/agent/docs/extensions.md)
