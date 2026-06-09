# Pi Provider Manager

[English](README.md) | [简体中文](README.zh-CN.md) | [日本語](README.ja.md) | 한국어 | [Español](README.es.md)

[pi coding agent](https://github.com/earendil-works/pi-mono)를 위한 대화형 프로바이더 및 모델 관리 도구입니다.

## 기능

✨ **대화형 UI** - 모든 작업에서 pi의 내장 선택/입력/확인 대화상자 사용  
🔧 **프로바이더 관리** - 사용자 정의 프로바이더 추가, 나열, 제거, 테스트  
📦 **모델 관리** - 각 프로바이더의 모델 추가, 나열, 제거, 편집  
🌐 **다중 API 지원** - OpenAI Completions, Anthropic Messages, Google Generative AI  
🔒 **안전한 API 키** - 환경 변수 지원(권장) 및 평문 경고  
🛡️ **자동 백업** - 타임스탬프가 있는 백업 및 순환(최근 10개 유지)  
🏥 **상태 확인** - `/provider doctor`를 통한 내장 진단  
⚡ **실제 테스트** - `/models`와 `/chat/completions` 두 엔드포인트 모두 테스트  
🎯 **고급 설정** - 추론, 호환성, 컨텍스트 윈도우 설정  
🔍 **모델 검색** - 추가 시 프로바이더에서 모델 가져오기  
🤖 **스마트 동기화** - 동기화 시 OpenRouter로 자동 설정  
📋 **메타데이터 표시** - 모델 소유자/조직 정보 표시  
🚀 **자동 가져오기** - `/provider import-models`로 프로바이더에서 모델 일괄 가져오기  
✏️ **모델 편집** - `/add-model edit`로 가져온 후 모델 설정 수정  
🔄 **백업/복원** - 프로바이더 설정 내보내기 및 가져오기  
🧹 **일괄 작업** - 프로바이더에서 모든 모델 지우기  
🔍 **스마트 필터링** - 대규모 모델 목록을 위한 키워드 필터  
⚡ **태그 모드** - y/n/s를 사용한 빠른 모델 선택

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
포괄적인 연결 테스트 수행:
- `/models` 엔드포인트 테스트(사용 가능한 모델 나열)
- `/chat/completions` 엔드포인트 테스트(실제 대화 기능)
- 인증 및 응답 검증
- 상세한 테스트 결과 및 오류 메시지 표시

#### `/provider doctor` - 진단 실행
설정 상태 확인:
- JSON 구조 검증
- 환경 변수 확인
- 타임스탬프가 있는 백업 기록 표시(최근 10개 유지)
- 설정 문제 보고

#### `/provider clear-models` - 프로바이더의 모든 모델 지우기
선택한 프로바이더에서 모든 모델 제거(대화형 확인 필요).

#### `/provider export` - 프로바이더 설정을 JSON 파일로 내보내기
하나 또는 모든 프로바이더 설정을 JSON 파일로 내보내기(백업 또는 공유용).

#### `/provider import` - JSON 파일에서 프로바이더 설정 가져오기
이전에 내보낸 JSON 파일에서 프로바이더 설정 가져오기.

#### `/provider sync` - 프로바이더와 모델 동기화
프로바이더와 모델 동기화(새 모델 추가, 삭제된 모델 제거). OpenRouter의 경우 기본 설정 자동 적용.

#### `/provider import-models` - 모델 자동 가져오기
프로바이더에서 모델 자동 검색 및 가져오기:
- `/models` 엔드포인트에서 사용 가능한 모델 가져오기
- **키워드 필터**로 대규모 모델 목록 범위 좁히기
- **태그 모드**(y/n/s)로 빠른 모델 선택
- 3가지 가져오기 모드: "모두 가져오기" / "태그 모드" / "취소"
- 4가지 설정 모드:
  - **기본값 사용** - 설정 없이 빠른 가져오기
  - **OpenRouter 기본값 사용** - OpenRouter 메타데이터로 자동 설정(모델 소유자, 컨텍스트 윈도우, 가격 등)
  - **일괄 설정** - 선택한 모든 모델에 동일한 설정 적용
  - **개별 설정** - 각 모델을 개별적으로 설정

#### `/provider doctor` - 진단 실행
설정 상태 확인:
- JSON 구조 검증
- 환경 변수 확인
- 타임스탬프가 있는 백업 기록 표시(최근 10개 유지)
- 설정 문제 보고

### 모델 명령

#### `/add-model add` - 프로바이더에 모델 추가
대화형 프롬프트:
- 프로바이더 선택 (구성된 목록에서)
- **모델 검색 옵션** - 프로바이더에서 사용 가능한 모델 가져오기 또는 수동 입력
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

#### `/add-model edit` - 기존 모델 설정 편집
모델 설정을 수정하기 위한 대화형 편집기:
- 프로바이더와 모델 선택
- 현재 설정 표시
- 여러 설정을 수정할 수 있는 루프 기반 편집기:
  - 모델 이름
  - 추론 지원
  - 컨텍스트 윈도우
  - 최대 출력 토큰 수
  - 호환성 설정
- 선택적 필드 지우기 가능

#### `/add-model clone` - 모델 복제
기존 모델을 같은 또는 다른 프로바이더에 새 모델 ID로 복제.

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
# 입력 방법 선택:
#   → 프로바이더에서 가져오기 (사용 가능한 모델 검색)
#   → 수동 입력
# [선택: 수동 입력]
# Model ID: llama3.1:8b
# Model Name: Llama 3.1 8B
# Configure advanced options? No

/add-model add
# Select provider: ollama
# 입력 방법 선택:
#   → 프로바이더에서 가져오기 (사용 가능한 모델 검색)
#   → 수동 입력
# [선택: 프로바이더에서 가져오기]
# ollama에서 모델 가져오는 중...
# 모델 선택: qwen2.5-coder:7b
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
# 
# Testing /models endpoint...
# ✓ Found 5 models
# 
# Testing /chat/completions endpoint...
# ✓ Chat completion successful
# 
# ✓ All tests passed
```

### 모델 자동 가져오기

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

### 모델 설정 편집

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

### 모델 복제

```bash
/add-model clone
# 소스 프로바이더 선택: ollama
# 복제할 모델 선택: llama3.1:8b
# 같은 프로바이더 또는 다른 프로바이더로 복제?
#   → 같은 프로바이더 (ollama)
#   → 다른 프로바이더
# [선택: 같은 프로바이더]
# 새 모델 ID: llama3.1:8b-custom
# ✓ 모델이 성공적으로 복제되었습니다
```

### 프로바이더와 모델 동기화

```bash
/provider sync
# 동기화할 프로바이더 선택: openrouter
# openrouter와 모델 동기화 중...
# 프로바이더에서 모델 가져오는 중...
# 5개의 새 모델과 2개의 삭제된 모델 발견
# 
# 추가할 새 모델:
#   • anthropic/claude-opus-4
#   • google/gemini-2.0-flash
#   ... 그 외 3개
# 
# 제거할 모델 (더 이상 사용 불가):
#   • old-model-1
#   • old-model-2
# 
# 동기화를 진행하시겠습니까? 예
# 새 모델에 OpenRouter 기본값 적용 중...
# ✓ 5개의 새 모델 추가됨
# ✓ 2개의 삭제된 모델 제거됨
# ✓ 동기화가 성공적으로 완료되었습니다
```

### 프로바이더 설정 내보내기 및 가져오기

```bash
# 단일 프로바이더 내보내기
/provider export
# 내보낼 프로바이더 선택: ollama
# 내보내기 파일 경로: ./ollama-config.json
# ✓ 프로바이더 "ollama"를 ./ollama-config.json으로 내보냈습니다

# 모든 프로바이더 내보내기
/provider export
# 내보낼 프로바이더 선택: [모든 프로바이더]
# 내보내기 파일 경로: ./all-providers.json
# ✓ 모든 프로바이더를 ./all-providers.json으로 내보냈습니다

# 프로바이더 설정 가져오기
/provider import
# 가져오기 파일 경로: ./ollama-config.json
# 파일에서 1개의 프로바이더 발견
# 프로바이더 "ollama"가 이미 존재합니다. 덮어쓰시겠습니까? 예
# ✓ 프로바이더 "ollama"를 성공적으로 가져왔습니다
```

### 프로바이더에서 모든 모델 지우기

```bash
/provider clear-models
# 프로바이더 선택: ollama
# 프로바이더 "ollama"에서 모든 17개의 모델을 제거합니다
# 확실합니까? 예
# ✓ 프로바이더 "ollama"에서 모든 모델을 지웠습니다
```

### 진단 실행

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

## 커뮤니티

💬 [Linux.do 커뮤니티](https://linux.do)에서 토론에 참여하세요 - Pi, AI, 오픈소스를 논의하는 친근한 중국어 기술 커뮤니티입니다.

## 라이선스

MIT

## 관련 링크

- [pi coding agent](https://github.com/earendil-works/pi-mono) - 메인 프로젝트
- [pi 확장 문서](https://github.com/earendil-works/pi-mono/blob/main/packages/agent/docs/extensions.md)
