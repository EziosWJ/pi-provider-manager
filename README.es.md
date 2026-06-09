# Pi Provider Manager

[English](README.md) | [简体中文](README.zh-CN.md) | [日本語](README.ja.md) | [한국어](README.ko.md) | Español

Gestor interactivo de proveedores y modelos para [pi coding agent](https://github.com/earendil-works/pi-mono).

## Características

✨ **Interfaz Interactiva** - Todas las operaciones usan los diálogos integrados de selección/entrada/confirmación de pi  
🔧 **Gestión de Proveedores** - Añadir, listar, eliminar y probar proveedores personalizados  
📦 **Gestión de Modelos** - Añadir, listar, eliminar y editar modelos para cada proveedor  
🌐 **Soporte Multi-API** - OpenAI Completions, Anthropic Messages, Google Generative AI  
🔒 **Claves API Seguras** - Soporte de variables de entorno (recomendado) con advertencias de texto plano  
🛡️ **Respaldo Automático** - Respaldos con marca de tiempo y rotación (mantiene los 10 más recientes)  
🏥 **Verificación de Salud** - Diagnóstico integrado con `/provider doctor`  
⚡ **Pruebas Reales** - Prueba tanto los endpoints `/models` como `/chat/completions`  
🎯 **Configuración Avanzada** - Razonamiento, compatibilidad, configuración de ventana de contexto  
🔍 **Descubrimiento de Modelos** - Obtener modelos del proveedor al añadir  
🤖 **Sincronización Inteligente** - Auto-configurar con OpenRouter al sincronizar  
📋 **Visualización de Metadatos** - Mostrar información del propietario/organización del modelo  
🚀 **Auto-Importación** - Importar modelos en lote desde proveedores con `/provider import-models`  
✏️ **Editar Modelos** - Modificar configuraciones de modelos después de importar con `/add-model edit`  
🔄 **Respaldo/Restauración** - Exportar e importar configuraciones de proveedores  
🧹 **Operaciones en Lote** - Limpiar todos los modelos del proveedor  
🔍 **Filtrado Inteligente** - Filtro por palabra clave para listas grandes de modelos  
⚡ **Modo de Etiquetado** - Selección rápida y/n/s para importar modelos

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
- **Método de Clave API** (Variable de entorno recomendada, o Entrada directa)

**Nota de Seguridad**: Usar variables de entorno mantiene tus claves API fuera del archivo de configuración.

#### `/provider list` - Listar todos los proveedores
Muestra nombre, URL, tipo de API, estado de la clave API (env o enmascarada) y cantidad de modelos para cada proveedor.

#### `/provider remove` - Eliminar proveedor
Selecciona de la lista de proveedores configurados, confirma antes de eliminar. La configuración se respalda automáticamente antes de la eliminación.

#### `/provider test` - Probar conexión del proveedor
Realiza pruebas de conectividad completas:
- Prueba el endpoint `/models` (lista modelos disponibles)
- Prueba el endpoint `/chat/completions` (funcionalidad de conversación real)
- Valida autenticación y respuesta
- Muestra resultados de prueba detallados y mensajes de error

#### `/provider doctor` - Ejecutar diagnósticos
Verificación de salud de tu configuración:
- Valida estructura JSON
- Verifica variables de entorno
- Muestra historial de respaldos con marca de tiempo (mantiene los 10 más recientes)
- Reporta problemas de configuración

#### `/provider clear-models` - Limpiar todos los modelos del proveedor
Eliminar todos los modelos de un proveedor seleccionado (requiere confirmación interactiva).

#### `/provider export` - Exportar configuración del proveedor a archivo JSON
Exportar una o todas las configuraciones de proveedores a un archivo JSON para respaldo o compartir.

#### `/provider import` - Importar configuración del proveedor desde archivo JSON
Importar configuraciones de proveedores desde un archivo JSON exportado previamente.

#### `/provider sync` - Sincronizar modelos con el proveedor
Sincronizar modelos con el proveedor (añadir nuevos modelos, eliminar los eliminados). Para OpenRouter, aplica automáticamente la configuración predeterminada.

#### `/provider import-models` - Auto-importar modelos
Descubre e importa modelos automáticamente desde el proveedor:
- Obtiene modelos disponibles desde el endpoint `/models`
- **Filtro por palabra clave** para reducir listas grandes de modelos
- **Modo de etiquetado** (y/n/s) para selección rápida de modelos
- Tres modos de importación: "Importar todo" / "Modo de etiquetado" / "Cancelar"
- Cuatro modos de configuración:
  - **Usar valores predeterminados** - Importación rápida sin configuración
  - **Usar valores predeterminados de OpenRouter** - Auto-configurar con metadatos de OpenRouter (propietario del modelo, ventana de contexto, precios, etc.)
  - **Configuración por lotes** - Mismos ajustes para todos los modelos seleccionados
  - **Configuración individual** - Configurar cada modelo por separado

#### `/provider doctor` - Ejecutar diagnósticos
Verificación de salud de tu configuración:
- Valida estructura JSON
- Verifica variables de entorno
- Muestra historial de respaldos con marca de tiempo (mantiene los 10 más recientes)
- Reporta problemas de configuración

### Comandos de Modelo

#### `/add-model add` - Añadir modelo a un proveedor
Indicaciones interactivas:
- Seleccionar proveedor (de la lista configurada)
- **Opción de descubrimiento de modelos** - Obtener modelos disponibles del proveedor o ingresar manualmente
- ID del modelo (ej: `gpt-4`, `llama3.1:8b`)
- Nombre del modelo (nombre de visualización opcional)
- **Opciones avanzadas** (opcional):
  - Soporte de razonamiento
  - Configuración de compatibilidad (developer role, reasoning_effort)
  - Tamaño de ventana de contexto
  - Tokens máximos de salida

#### `/add-model list [provider]` - Listar modelos
- Sin argumento: lista todos los modelos de todos los proveedores
- Con nombre de proveedor: lista solo los modelos de ese proveedor
- Muestra indicadores: `[reasoning]`, `[compat]`

#### `/add-model edit` - Editar configuración de modelo existente
Editor interactivo para modificar ajustes de modelos:
- Seleccionar proveedor y modelo
- Muestra la configuración actual
- Editor basado en bucle para modificar múltiples ajustes:
  - Nombre del modelo
  - Soporte de razonamiento
  - Ventana de contexto
  - Tokens máximos de salida
  - Configuración de compatibilidad
- Puede limpiar campos opcionales

#### `/add-model clone` - Clonar un modelo
Clonar un modelo existente al mismo o diferente proveedor con un nuevo ID de modelo.

#### `/add-model remove` - Eliminar modelo
Indicaciones interactivas:
- Seleccionar proveedor
- Seleccionar modelo (de ese proveedor)
- Confirmar eliminación
- La configuración se respalda automáticamente antes de la eliminación

## Ejemplos

### Añadir Proveedor Ollama con Variable de Entorno

```bash
pi
/provider add
# Name: ollama
# Base URL: http://localhost:11434/v1
# API type: OpenAI Completions
# API Key method: Environment Variable (Recommended)
# Environment variable name: OLLAMA_API_KEY

# Luego configura la variable de entorno:
export OLLAMA_API_KEY=ollama
```

### Añadir Modelos a Ollama

```bash
/add-model add
# Select provider: ollama
# Elegir método de entrada:
#   → Obtener del proveedor (descubrir modelos disponibles)
#   → Ingresar manualmente
# [Seleccionar: Ingresar manualmente]
# Model ID: llama3.1:8b
# Model Name: Llama 3.1 8B
# Configure advanced options? No

/add-model add
# Select provider: ollama
# Elegir método de entrada:
#   → Obtener del proveedor (descubrir modelos disponibles)
#   → Ingresar manualmente
# [Seleccionar: Obtener del proveedor]
# Obteniendo modelos de ollama...
# Seleccionar un modelo: qwen2.5-coder:7b
# Model Name: Qwen 2.5 Coder 7B
# Configure advanced options? Yes
# Does this model support reasoning? Yes
# ...
```

### Probar Conexión del Proveedor

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

### Auto-Importar Modelos

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

### Editar Configuración de Modelo

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

### Clonar un Modelo

```bash
/add-model clone
# Seleccionar proveedor de origen: ollama
# Seleccionar modelo a clonar: llama3.1:8b
# ¿Clonar al mismo proveedor o a uno diferente?
#   → Mismo proveedor (ollama)
#   → Proveedor diferente
# [Seleccionar: Mismo proveedor]
# Nuevo ID de modelo: llama3.1:8b-custom
# ✓ Modelo clonado exitosamente
```

### Sincronizar Modelos con el Proveedor

```bash
/provider sync
# Seleccionar proveedor a sincronizar: openrouter
# Sincronizando modelos con openrouter...
# Obteniendo modelos del proveedor...
# Se encontraron 5 modelo(s) nuevo(s) y 2 modelo(s) eliminado(s)
# 
# Nuevos modelos a añadir:
#   • anthropic/claude-opus-4
#   • google/gemini-2.0-flash
#   ... y 3 más
# 
# Modelos a eliminar (ya no disponibles):
#   • old-model-1
#   • old-model-2
# 
# ¿Proceder con la sincronización? Sí
# Aplicando valores predeterminados de OpenRouter para nuevos modelos...
# ✓ Se añadieron 5 modelo(s) nuevo(s)
# ✓ Se eliminaron 2 modelo(s) eliminado(s)
# ✓ Sincronización completada exitosamente
```

### Exportar e Importar Configuración de Proveedor

```bash
# Exportar un solo proveedor
/provider export
# Seleccionar proveedor a exportar: ollama
# Ruta del archivo de exportación: ./ollama-config.json
# ✓ Proveedor "ollama" exportado a ./ollama-config.json

# Exportar todos los proveedores
/provider export
# Seleccionar proveedor a exportar: [Todos los proveedores]
# Ruta del archivo de exportación: ./all-providers.json
# ✓ Todos los proveedores exportados a ./all-providers.json

# Importar configuración de proveedor
/provider import
# Ruta del archivo de importación: ./ollama-config.json
# Se encontró(aron) 1 proveedor(es) en el archivo
# El proveedor "ollama" ya existe. ¿Sobrescribir? Sí
# ✓ Proveedor "ollama" importado exitosamente
```

### Limpiar Todos los Modelos del Proveedor

```bash
/provider clear-models
# Seleccionar proveedor: ollama
# Esto eliminará todos los 17 modelo(s) del proveedor "ollama"
# ¿Está seguro? Sí
# ✓ Se limpiaron todos los modelos del proveedor "ollama"
```

### Ejecutar Diagnósticos

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

## Comunidad

💬 Únete a la discusión en [Linux.do Community](https://linux.do) - Una comunidad tecnológica china amigable para discusiones sobre Pi, IA y código abierto.

## Licencia

MIT

## Enlaces Relacionados

- [pi coding agent](https://github.com/earendil-works/pi-mono) - Proyecto principal
- [Documentación de extensiones de pi](https://github.com/earendil-works/pi-mono/blob/main/packages/agent/docs/extensions.md)
