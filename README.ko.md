# Pi Provider Manager

[English](README.md) | [简体中文](README.zh-CN.md) | [日本語](README.ja.md) | 한국어 | [Español](README.es.md)

[pi coding agent](https://github.com/earendil-works/pi-mono)를 위한 대화형 프로바이더 및 모델 관리 도구입니다.

## 기능

✨ **대화형 UI** - 모든 작업에서 pi의 내장 선택/입력/확인 대화상자 사용  
🔧 **프로바이더 관리** - 사용자 정의 프로바이더 추가, 나열, 제거, 테스트  
📦 **모델 관리** - 각 프로바이더의 모델 추가, 나열, 제거  
🌐 **다중 API 지원** - OpenAI Completions, Anthropic Messages, Google Generative AI  
🔒 **안전한 API 키** - 환경 변수 지원(권장) 및 평문 경고  
🛡️ **자동 백업** - 변경 전 설정 자동 백업  
🏥 **상태 확인** - `/provider doctor`를 통한 내장 진단  
⚡ **실제 테스트** - URL 검증뿐만 아니라 실제 연결 테스트  
🎯 **고급 설정** - 추론, 호환성, 컨텍스트 윈도우, 비용 설정

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
- **API 키 방법** (환경 변수 권장, 또는 직접 입력)

**보안 참고**: 환경 변수를 사용하면 API 키가 설정 파일 밖에 보관됩니다.

#### `/provider list` - 모든 프로바이더 나열
각 프로바이더의 이름, URL, API 유형, API 키 상태(환경 변수 또는 마스킹), 모델 수를 표시합니다.

#### `/provider remove` - 프로바이더 제거
구성된 프로바이더 목록에서 선택하고 삭제 전 확인합니다. 설정은 제거 전에 자동으로 백업됩니다.

#### `/provider test` - 프로바이더 연결 테스트
실제 연결 테스트를 수행:
- OpenAI 호환 API의 경우: `/models` 엔드포인트 테스트
- 인증 및 응답 검증
- 상세한 오류 메시지 표시

#### `/provider doctor` - 진단 실행
설정 상태 확인:
- JSON 구조 검증
- 환경 변수 확인
- 백업 위치 표시
- 설정 문제 보고

### 모델 명령

#### `/add-model add` - 프로바이더에 모델 추가
대화형 프롬프트:
- 프로바이더 선택 (구성된 목록에서)
- 모델 ID (예: `gpt-4`, `llama3.1:8b`)
- 모델 이름 (선택적 표시 이름)
- **고급 옵션** (선택사항):
  - 추론 지원
  - 호환성 설정 (developer role, reasoning_effort)
  - 컨텍스트 윈도우 크기
  - 최대 출력 토큰 수

#### `/add-model list [provider]` - 모델 나열
- 인수 없음: 모든 프로바이더의 모든 모델 나열
- 프로바이더 이름 포함: 해당 프로바이더의 모델만 나열
- 표시기 표시: `[reasoning]`, `[compat]`

#### `/add-model remove` - 모델 제거
대화형 프롬프트:
- 프로바이더 선택
- 모델 선택 (해당 프로바이더에서)
- 삭제 확인
- 설정은 제거 전에 자동으로 백업됩니다

## 사용 예시

### 환경 변수로 Ollama 프로바이더 추가

```bash
pi
/provider add
# Name: ollama
# Base URL: http://localhost:11434/v1
# API type: OpenAI Completions
# API Key method: Environment Variable (Recommended)
# Environment variable name: OLLAMA_API_KEY

# 그런 다음 환경 변수 설정:
export OLLAMA_API_KEY=ollama
```

### Ollama에 모델 추가

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

### 프로바이더 연결 테스트

```bash
/provider test
# Select provider: ollama
# Testing ollama...
# URL: http://localhost:11434/v1
# ✓ Connection successful
```

### 진단 실행

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
