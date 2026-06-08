# Pi Provider Manager

[English](README.md) | [简体中文](README.zh-CN.md) | [日本語](README.ja.md) | [한국어](README.ko.md) | Español

Gestor interactivo de proveedores y modelos para [pi coding agent](https://github.com/earendil-works/pi-mono).

## Características

✨ **Interfaz Interactiva** - Todas las operaciones usan los diálogos integrados de selección/entrada/confirmación de pi  
🔧 **Gestión de Proveedores** - Añadir, listar, eliminar y probar proveedores personalizados  
📦 **Gestión de Modelos** - Añadir, listar y eliminar modelos para cada proveedor  
🌐 **Soporte Multi-API** - OpenAI Completions, Anthropic Messages, Google Generative AI

## Instalación

### Instalación Automática (Recomendada)

```bash
curl -o ~/.pi/agent/extensions/provider-manager.ts \
  https://raw.githubusercontent.com/EziosWJ/pi-provider-manager/main/provider-manager.ts
```

### Instalación Manual

1. Descarga [provider-manager.ts](https://raw.githubusercontent.com/EziosWJ/pi-provider-manager/main/provider-manager.ts)
2. Colócalo en `~/.pi/agent/extensions/` (global) o `.pi/extensions/` (local del proyecto)
3. Reinicia pi o ejecuta `/reload`

## Uso

La extensión se carga automáticamente al iniciar pi. Verás esta notificación:

```
Provider Manager: X custom provider(s) loaded
Use /provider or /add-model to manage configurations
```

### Comandos de Proveedor

#### `/provider add` - Añadir nuevo proveedor
Indicaciones interactivas:
- Nombre del proveedor
- URL base (ej: `http://localhost:11434/v1`)
- Tipo de API (selecciona de la lista)
- Clave API

#### `/provider list` - Listar todos los proveedores
Muestra nombre, URL, tipo de API y cantidad de modelos para cada proveedor.

#### `/provider remove` - Eliminar proveedor
Selecciona de la lista de proveedores configurados, confirma antes de eliminar.

#### `/provider test <name>` - Probar URL del proveedor
Valida la URL base del proveedor.

### Comandos de Modelo

#### `/add-model add` - Añadir modelo a un proveedor
Indicaciones interactivas:
- Seleccionar proveedor (de la lista configurada)
- ID del modelo (ej: `gpt-4`, `llama3.1:8b`)
- Nombre del modelo (nombre de visualización opcional)

#### `/add-model list [provider]` - Listar modelos
- Sin argumento: lista todos los modelos de todos los proveedores
- Con nombre de proveedor: lista solo los modelos de ese proveedor

#### `/add-model remove` - Eliminar modelo
Indicaciones interactivas:
- Seleccionar proveedor
- Seleccionar modelo (de ese proveedor)
- Confirmar eliminación

## Ejemplos

### Añadir Proveedor Ollama

```bash
pi
/provider add
# Name: ollama
# Base URL: http://localhost:11434/v1
# API type: OpenAI Completions
# API Key: ollama
```

### Añadir Modelos a Ollama

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

### Usar los Modelos

```bash
# Sal de pi (Ctrl+D), luego:
pi --provider ollama --model llama3.1:8b "¡Hola!"
```

### Añadir Alias de Shell

```bash
# Añade a ~/.zshrc o ~/.bashrc
alias pi-llama='pi --provider ollama --model llama3.1:8b'
alias pi-qwen='pi --provider ollama --model qwen2.5-coder:7b'
```

## Archivo de Configuración

La extensión gestiona `~/.pi/agent/models.json`. Ejemplo:

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

## APIs Soportadas

- **`openai-completions`** - Endpoints compatibles con OpenAI (Ollama, LM Studio, vLLM, etc.)
- **`anthropic-messages`** - API de Anthropic Claude
- **`google-generative-ai`** - API de Google Gemini

## Solución de Problemas

### La extensión no se carga

Verifica la ubicación de la extensión:
```bash
ls ~/.pi/agent/extensions/provider-manager.ts
```

Recarga manualmente:
```bash
pi -e ~/.pi/agent/extensions/provider-manager.ts
```

### Conflictos de comandos

Si ves advertencias sobre conflictos con `/model`, es normal - la extensión usa `/add-model` en su lugar.

### Los modelos no aparecen

Después de añadir proveedores y modelos, reinicia pi o ejecuta `/reload` para refrescar la configuración.

## Contribuir

Issues y Pull Requests son bienvenidos en [GitHub](https://github.com/EziosWJ/pi-provider-manager).

## Licencia

MIT

## Enlaces Relacionados

- [pi coding agent](https://github.com/earendil-works/pi-mono) - Proyecto principal
- [Documentación de extensiones de pi](https://github.com/earendil-works/pi-mono/blob/main/packages/agent/docs/extensions.md)
