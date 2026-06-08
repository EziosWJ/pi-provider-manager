import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

interface Provider {
  baseUrl: string;
  api: "openai-completions" | "anthropic-messages" | "google-generative-ai";
  apiKey: string;
  models: Array<{
    id: string;
    name?: string;
    reasoning?: boolean;
    contextWindow?: number;
    maxTokens?: number;
  }>;
  compat?: {
    supportsDeveloperRole?: boolean;
    supportsReasoningEffort?: boolean;
  };
}

interface ModelsConfig {
  providers: Record<string, Provider>;
}

const CONFIG_PATH = path.join(os.homedir(), ".pi", "agent", "models.json");

function loadConfig(): ModelsConfig {
  if (!fs.existsSync(CONFIG_PATH)) {
    return { providers: {} };
  }
  try {
    const content = fs.readFileSync(CONFIG_PATH, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    return { providers: {} };
  }
}

function saveConfig(config: ModelsConfig): void {
  const dir = path.dirname(CONFIG_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
}

export default function (pi: ExtensionAPI) {
  // /provider add <name> <baseUrl> <api> [apiKey]
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

        const apiKey = await ctx.ui.input("API Key:", "sk-any");
        if (!apiKey) {
          ctx.ui.notify("API Key is required", "error");
          return;
        }

        const config = loadConfig();

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

        saveConfig(config);
        ctx.ui.notify(`✓ Provider "${name}" added successfully`, "success");

      } else if (action === "list") {
        const config = loadConfig();
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
          output += `  Models: ${p.models.length}\n\n`;
        }

        ctx.ui.notify(output, "info");

      } else if (action === "remove") {
        const config = loadConfig();
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
        saveConfig(config);
        ctx.ui.notify(`✓ Provider "${name}" removed`, "success");

      } else if (action === "test") {
        const [name] = rest;

        if (!name) {
          ctx.ui.notify("Usage: /provider test <name>", "error");
          return;
        }

        const config = loadConfig();
        const provider = config.providers[name];

        if (!provider) {
          ctx.ui.notify(`Provider "${name}" not found`, "error");
          return;
        }

        ctx.ui.notify(`Testing ${name}...\nURL: ${provider.baseUrl}`, "info");

        try {
          const url = new URL(provider.baseUrl);
          ctx.ui.notify(`✓ URL is valid: ${url.origin}`, "success");
        } catch (error) {
          ctx.ui.notify(`✗ Invalid URL: ${error}`, "error");
        }

      } else {
        ctx.ui.notify(
          "Provider Management Commands:\n\n" +
          "/provider add <name> <baseUrl> <api> [apiKey]\n" +
          "/provider list\n" +
          "/provider remove <name>\n" +
          "/provider test <name>\n\n" +
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
        const providers = Object.keys(config.providers);

        if (providers.length === 0) {
          ctx.ui.notify("No providers configured. Add one first with /provider add", "error");
          return;
        }

        // Interactive mode: prompt for each field
        const providerName = await ctx.ui.select(
          "Select provider:",
          providers.map((p) => p)  // Return array of strings directly
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

        const provider = config.providers[providerName];
        const existingIndex = provider.models.findIndex((m) => m.id === modelId);

        if (existingIndex >= 0) {
          const ok = await ctx.ui.confirm(
            `Model "${modelId}" already exists. Overwrite?`,
            "Overwrite?"
          );
          if (!ok) return;
          provider.models[existingIndex] = { id: modelId, name: modelName };
        } else {
          provider.models.push({ id: modelId, name: modelName || modelId });
        }

        saveConfig(config);
        ctx.ui.notify(`✓ Model "${modelId}" added to provider "${providerName}"`, "success");

      } else if (action === "list") {
        const [providerName] = rest;
        const config = loadConfig();

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
        saveConfig(config);
        ctx.ui.notify(`✓ Model "${modelId}" removed from provider "${providerName}"`, "success");

      } else {
        ctx.ui.notify(
          "Model Management Commands:\n\n" +
          "/add-model add <provider> <id> [name]\n" +
          "/add-model list [provider]\n" +
          "/add-model remove <provider> <id>",
          "info"
        );
      }
    },
  });

  // Session start notification
  pi.on("session_start", async (_event, ctx) => {
    const config = loadConfig();
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
