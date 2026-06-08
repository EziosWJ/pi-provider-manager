import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

interface ModelConfig {
  id: string;
  name?: string;
  reasoning?: boolean;
  input?: string[];
  contextWindow?: number;
  maxTokens?: number;
  cost?: {
    input?: number;
    output?: number;
    cacheRead?: number;
    cacheWrite?: number;
  };
  compat?: {
    supportsDeveloperRole?: boolean;
    supportsReasoningEffort?: boolean;
  };
  thinkingLevelMap?: Record<string, string>;
}

interface Provider {
  baseUrl: string;
  api: "openai-completions" | "anthropic-messages" | "google-generative-ai";
  apiKey: string;
  models: ModelConfig[];
  compat?: {
    supportsDeveloperRole?: boolean;
    supportsReasoningEffort?: boolean;
  };
}

interface ModelsConfig {
  providers: Record<string, Provider>;
}

const CONFIG_PATH = path.join(os.homedir(), ".pi", "agent", "models.json");
const BACKUP_PATH = path.join(os.homedir(), ".pi", "agent", "models.json.backup");

function backupConfig(): void {
  if (fs.existsSync(CONFIG_PATH)) {
    fs.copyFileSync(CONFIG_PATH, BACKUP_PATH);
  }
}

function loadConfig(): ModelsConfig | null {
  if (!fs.existsSync(CONFIG_PATH)) {
    return { providers: {} };
  }
  try {
    const content = fs.readFileSync(CONFIG_PATH, "utf-8");
    const config = JSON.parse(content);
    return config;
  } catch (error) {
    // Don't return empty config on error - return null to indicate failure
    return null;
  }
}

function saveConfig(config: ModelsConfig): boolean {
  try {
    // Backup before writing
    backupConfig();

    const dir = path.dirname(CONFIG_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
    return true;
  } catch (error) {
    return false;
  }
}

async function testProviderConnection(
  baseUrl: string,
  apiKey: string,
  api: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Test basic connectivity
    const url = new URL(baseUrl);

    // For OpenAI-compatible APIs, try /models endpoint
    if (api === "openai-completions") {
      const response = await fetch(`${baseUrl}/models`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        return { success: true, message: "Connection successful" };
      } else {
        return {
          success: false,
          message: `HTTP ${response.status}: ${response.statusText}`,
        };
      }
    }

    // For other APIs, just validate URL
    return { success: true, message: `URL valid: ${url.origin}` };
  } catch (error: any) {
    return { success: false, message: error.message || "Connection failed" };
  }
}

export default function (pi: ExtensionAPI) {
  // /provider add
  pi.registerCommand("provider", {
    description: "Manage custom providers in models.json",
    handler: async (args, ctx) => {
      const parts = args?.trim().split(/\s+/) || [];
      const [action, ...rest] = parts;

      if (action === "add") {
        // Interactive mode: prompt for each field
        const name = await ctx.ui.input("Provider name:", "");
        if (!name) {
          ctx.ui.notify("Provider name is required", "error");
          return;
        }

        const baseUrl = await ctx.ui.input("Base URL:", "http://localhost:11434/v1");
        if (!baseUrl) {
          ctx.ui.notify("Base URL is required", "error");
          return;
        }

        const api = await ctx.ui.select(
          "API type:",
          [
            { label: "OpenAI Completions", value: "openai-completions" },
            { label: "Anthropic Messages", value: "anthropic-messages" },
            { label: "Google Generative AI", value: "google-generative-ai" },
          ]
        );

        if (!api) {
          ctx.ui.notify("Cancelled", "info");
          return;
        }

        // Suggest environment variable for API key
        const keyMethod = await ctx.ui.select(
          "API Key method:",
          [
            { label: "Environment Variable (Recommended)", value: "env" },
            { label: "Direct Input", value: "direct" },
          ]
        );

        if (!keyMethod) {
          ctx.ui.notify("Cancelled", "info");
          return;
        }

        let apiKey: string;
        if (keyMethod === "env") {
          const envVar = await ctx.ui.input(
            "Environment variable name:",
            `${name.toUpperCase()}_API_KEY`
          );
          if (!envVar) {
            ctx.ui.notify("Cancelled", "info");
            return;
          }
          apiKey = `$${envVar}`;
          ctx.ui.notify(
            `Remember to set: export ${envVar}=your-api-key`,
            "info"
          );
        } else {
          apiKey = await ctx.ui.input("API Key:", "sk-any");
          if (!apiKey) {
            ctx.ui.notify("API Key is required", "error");
            return;
          }
          ctx.ui.notify(
            "⚠️  API key will be stored in plaintext. Consider using environment variables.",
            "warning"
          );
        }

        const config = loadConfig();
        if (config === null) {
          ctx.ui.notify(
            "Failed to load models.json. File may be corrupted. Use /provider doctor to diagnose.",
            "error"
          );
          return;
        }

        if (config.providers[name]) {
          const ok = await ctx.ui.confirm(
            `Provider "${name}" already exists. Overwrite?`,
            "Overwrite?"
          );
          if (!ok) return;
        }

        config.providers[name] = {
          baseUrl,
          api: api as any,
          apiKey,
          models: [],
        };

        if (saveConfig(config)) {
          ctx.ui.notify(`✓ Provider "${name}" added successfully`, "success");
        } else {
          ctx.ui.notify("Failed to save configuration", "error");
        }

      } else if (action === "list") {
        const config = loadConfig();
        if (config === null) {
          ctx.ui.notify("Failed to load models.json", "error");
          return;
        }

        const providers = Object.keys(config.providers);

        if (providers.length === 0) {
          ctx.ui.notify("No providers configured", "info");
          return;
        }

        let output = "Configured Providers:\n\n";
        for (const name of providers) {
          const p = config.providers[name];
          output += `• ${name}\n`;
          output += `  URL: ${p.baseUrl}\n`;
          output += `  API: ${p.api}\n`;
          output += `  Key: ${p.apiKey.startsWith("$") ? p.apiKey + " (env)" : "***"}\n`;
          output += `  Models: ${p.models.length}\n\n`;
        }

        ctx.ui.notify(output, "info");

      } else if (action === "remove") {
        const config = loadConfig();
        if (config === null) {
          ctx.ui.notify("Failed to load models.json", "error");
          return;
        }

        const providers = Object.keys(config.providers);

        if (providers.length === 0) {
          ctx.ui.notify("No providers configured", "info");
          return;
        }

        // Interactive mode: select provider to remove
        const name = await ctx.ui.select(
          "Select provider to remove:",
          providers.map((p) => p)
        );

        if (!name) {
          ctx.ui.notify("Cancelled", "info");
          return;
        }

        const ok = await ctx.ui.confirm(
          `Delete provider "${name}" and all its models?`,
          "Confirm deletion"
        );

        if (!ok) return;

        delete config.providers[name];

        if (saveConfig(config)) {
          ctx.ui.notify(`✓ Provider "${name}" removed`, "success");
        } else {
          ctx.ui.notify("Failed to save configuration", "error");
        }

      } else if (action === "test") {
        const config = loadConfig();
        if (config === null) {
          ctx.ui.notify("Failed to load models.json", "error");
          return;
        }

        const providers = Object.keys(config.providers);

        if (providers.length === 0) {
          ctx.ui.notify("No providers configured", "info");
          return;
        }

        const name = await ctx.ui.select(
          "Select provider to test:",
          providers.map((p) => p)
        );

        if (!name) {
          ctx.ui.notify("Cancelled", "info");
          return;
        }

        const provider = config.providers[name];
        ctx.ui.notify(`Testing ${name}...\nURL: ${provider.baseUrl}`, "info");

        // Resolve API key from environment if needed
        let apiKey = provider.apiKey;
        if (apiKey.startsWith("$")) {
          const envVar = apiKey.slice(1);
          apiKey = process.env[envVar] || "";
          if (!apiKey) {
            ctx.ui.notify(
              `Environment variable ${envVar} is not set`,
              "error"
            );
            return;
          }
        }

        const result = await testProviderConnection(
          provider.baseUrl,
          apiKey,
          provider.api
        );

        if (result.success) {
          ctx.ui.notify(`✓ ${result.message}`, "success");
        } else {
          ctx.ui.notify(`✗ ${result.message}`, "error");
        }

      } else if (action === "doctor") {
        ctx.ui.notify("Running diagnostics...", "info");

        const config = loadConfig();

        if (config === null) {
          ctx.ui.notify(
            "✗ models.json is corrupted or invalid JSON\n\n" +
            `Backup available at: ${BACKUP_PATH}\n` +
            "To restore: cp ~/.pi/agent/models.json.backup ~/.pi/agent/models.json",
            "error"
          );
          return;
        }

        let report = "Configuration Health Check:\n\n";
        report += `✓ models.json is valid JSON\n`;
        report += `✓ Location: ${CONFIG_PATH}\n`;

        if (fs.existsSync(BACKUP_PATH)) {
          report += `✓ Backup exists: ${BACKUP_PATH}\n`;
        }

        const providerCount = Object.keys(config.providers).length;
        report += `\nProviders: ${providerCount}\n`;

        for (const [name, provider] of Object.entries(config.providers)) {
          report += `\n• ${name}\n`;

          // Check API key
          if (provider.apiKey.startsWith("$")) {
            const envVar = provider.apiKey.slice(1);
            if (process.env[envVar]) {
              report += `  ✓ API key (${envVar}) is set\n`;
            } else {
              report += `  ✗ API key (${envVar}) is NOT set\n`;
            }
          } else {
            report += `  ⚠️  API key is stored in plaintext\n`;
          }

          report += `  Models: ${provider.models.length}\n`;
        }

        ctx.ui.notify(report, "info");

      } else {
        ctx.ui.notify(
          "Provider Management Commands:\n\n" +
          "/provider add - Add provider (interactive)\n" +
          "/provider list - List all providers\n" +
          "/provider remove - Remove provider (interactive)\n" +
          "/provider test - Test provider connection (interactive)\n" +
          "/provider doctor - Run diagnostics\n\n" +
          "APIs: openai-completions, anthropic-messages, google-generative-ai",
          "info"
        );
      }
    },
  });

  // /add-model add <provider> <id> [name]
  pi.registerCommand("add-model", {
    description: "Manage models for custom providers",
    handler: async (args, ctx) => {
      const parts = args?.trim().split(/\s+/) || [];
      const [action, ...rest] = parts;

      if (action === "add") {
        const config = loadConfig();
        if (config === null) {
          ctx.ui.notify("Failed to load models.json", "error");
          return;
        }

        const providers = Object.keys(config.providers);

        if (providers.length === 0) {
          ctx.ui.notify("No providers configured. Add one first with /provider add", "error");
          return;
        }

        // Interactive mode: prompt for each field
        const providerName = await ctx.ui.select(
          "Select provider:",
          providers.map((p) => p)
        );

        if (!providerName) {
          ctx.ui.notify("Cancelled", "info");
          return;
        }

        const modelId = await ctx.ui.input("Model ID:", "");
        if (!modelId) {
          ctx.ui.notify("Model ID is required", "error");
          return;
        }

        const modelName = await ctx.ui.input("Model Name (optional):", modelId);

        // Advanced options
        const addAdvanced = await ctx.ui.confirm(
          "Configure advanced options (reasoning, compat, cost)?",
          "Advanced options"
        );

        const modelConfig: ModelConfig = {
          id: modelId,
          name: modelName || modelId,
        };

        if (addAdvanced) {
          // Reasoning support
          const reasoning = await ctx.ui.confirm(
            "Does this model support reasoning?",
            "Reasoning support"
          );
          if (reasoning) {
            modelConfig.reasoning = true;
          }

          // Compatibility options
          const needCompat = await ctx.ui.confirm(
            "Does this model have compatibility issues (e.g., no developer role)?",
            "Compatibility settings"
          );

          if (needCompat) {
            const supportsDev = await ctx.ui.confirm(
              "Does it support developer role?",
              "Developer role"
            );
            const supportsReasoning = await ctx.ui.confirm(
              "Does it support reasoning_effort parameter?",
              "Reasoning effort"
            );

            modelConfig.compat = {
              supportsDeveloperRole: supportsDev,
              supportsReasoningEffort: supportsReasoning,
            };
          }

          // Context window
          const contextInput = await ctx.ui.input(
            "Context window (optional, e.g., 128000):",
            ""
          );
          if (contextInput) {
            const contextWindow = parseInt(contextInput, 10);
            if (!isNaN(contextWindow)) {
              modelConfig.contextWindow = contextWindow;
            }
          }

          // Max tokens
          const maxInput = await ctx.ui.input(
            "Max output tokens (optional, e.g., 4096):",
            ""
          );
          if (maxInput) {
            const maxTokens = parseInt(maxInput, 10);
            if (!isNaN(maxTokens)) {
              modelConfig.maxTokens = maxTokens;
            }
          }
        }

        const provider = config.providers[providerName];
        const existingIndex = provider.models.findIndex((m) => m.id === modelId);

        if (existingIndex >= 0) {
          const ok = await ctx.ui.confirm(
            `Model "${modelId}" already exists. Overwrite?`,
            "Overwrite?"
          );
          if (!ok) return;
          provider.models[existingIndex] = modelConfig;
        } else {
          provider.models.push(modelConfig);
        }

        if (saveConfig(config)) {
          ctx.ui.notify(`✓ Model "${modelId}" added to provider "${providerName}"`, "success");
        } else {
          ctx.ui.notify("Failed to save configuration", "error");
        }

      } else if (action === "list") {
        const [providerName] = rest;
        const config = loadConfig();

        if (config === null) {
          ctx.ui.notify("Failed to load models.json", "error");
          return;
        }

        if (providerName) {
          const provider = config.providers[providerName];
          if (!provider) {
            ctx.ui.notify(`Provider "${providerName}" not found`, "error");
            return;
          }

          if (provider.models.length === 0) {
            ctx.ui.notify(`No models configured for provider "${providerName}"`, "info");
            return;
          }

          let output = `Models for "${providerName}":\n\n`;
          for (const model of provider.models) {
            output += `• ${model.id}`;
            if (model.name && model.name !== model.id) {
              output += ` (${model.name})`;
            }
            if (model.reasoning) {
              output += ` [reasoning]`;
            }
            if (model.compat) {
              output += ` [compat]`;
            }
            output += "\n";
          }
          ctx.ui.notify(output, "info");
        } else {
          let output = "All Models:\n\n";
          let hasModels = false;

          for (const [name, provider] of Object.entries(config.providers)) {
            if (provider.models.length > 0) {
              hasModels = true;
              output += `${name}:\n`;
              for (const model of provider.models) {
                output += `  • ${model.id}`;
                if (model.name && model.name !== model.id) {
                  output += ` (${model.name})`;
                }
                if (model.reasoning) {
                  output += ` [reasoning]`;
                }
                output += "\n";
              }
              output += "\n";
            }
          }

          if (!hasModels) {
            ctx.ui.notify("No models configured", "info");
            return;
          }

          ctx.ui.notify(output, "info");
        }

      } else if (action === "remove") {
        const config = loadConfig();
        if (config === null) {
          ctx.ui.notify("Failed to load models.json", "error");
          return;
        }

        const providers = Object.keys(config.providers);

        if (providers.length === 0) {
          ctx.ui.notify("No providers configured", "info");
          return;
        }

        // Interactive mode: select provider first
        const providerName = await ctx.ui.select(
          "Select provider:",
          providers.map((p) => p)
        );

        if (!providerName) {
          ctx.ui.notify("Cancelled", "info");
          return;
        }

        const provider = config.providers[providerName];

        if (provider.models.length === 0) {
          ctx.ui.notify(`No models in provider "${providerName}"`, "info");
          return;
        }

        // Select model to remove
        const modelId = await ctx.ui.select(
          "Select model to remove:",
          provider.models.map((m) => m.id)
        );

        if (!modelId) {
          ctx.ui.notify("Cancelled", "info");
          return;
        }

        const ok = await ctx.ui.confirm(
          `Delete model "${modelId}" from provider "${providerName}"?`,
          "Confirm deletion"
        );

        if (!ok) return;

        const index = provider.models.findIndex((m) => m.id === modelId);

        if (index < 0) {
          ctx.ui.notify(`Model "${modelId}" not found in provider "${providerName}"`, "error");
          return;
        }

        provider.models.splice(index, 1);

        if (saveConfig(config)) {
          ctx.ui.notify(`✓ Model "${modelId}" removed from provider "${providerName}"`, "success");
        } else {
          ctx.ui.notify("Failed to save configuration", "error");
        }

      } else {
        ctx.ui.notify(
          "Model Management Commands:\n\n" +
          "/add-model add - Add model (interactive)\n" +
          "/add-model list [provider] - List models\n" +
          "/add-model remove - Remove model (interactive)",
          "info"
        );
      }
    },
  });

  // Session start notification
  pi.on("session_start", async (_event, ctx) => {
    const config = loadConfig();

    if (config === null) {
      ctx.ui.notify(
        "⚠️  Provider Manager: models.json is corrupted\n" +
        "Run /provider doctor for diagnostics",
        "warning"
      );
      return;
    }

    const providerCount = Object.keys(config.providers).length;
    if (providerCount > 0) {
      ctx.ui.notify(
        `Provider Manager: ${providerCount} custom provider(s) loaded\n` +
        "Use /provider or /add-model to manage configurations",
        "info"
      );
    }
  });
}
