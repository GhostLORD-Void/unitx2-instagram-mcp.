import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const GRAPH_VERSION = process.env.IG_GRAPH_API_VERSION;
const IG_USER_ID = process.env.IG_USER_ID;
const ACCESS_TOKEN = process.env.IG_ACCESS_TOKEN;

function configurationError() {
  if (!GRAPH_VERSION || !/^v\d+\.\d+$/.test(GRAPH_VERSION)) {
    return "Set IG_GRAPH_API_VERSION to a currently supported Meta Graph API version.";
  }
  if (!IG_USER_ID) return "Set IG_USER_ID to your Instagram Professional Account ID.";
  if (!ACCESS_TOKEN) return "Set IG_ACCESS_TOKEN in the MCP host's secure environment.";
  return null;
}

async function graphGet(path, params = {}) {
  const missing = configurationError();
  if (missing) throw new Error(missing);
  const url = new URL("https://graph.facebook.com/" + GRAPH_VERSION + "/" + path);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  const response = await fetch(url, {
    headers: { Authorization: "Bearer " + ACCESS_TOKEN },
    signal: AbortSignal.timeout(15000)
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.error?.message || "Meta Graph API returned HTTP " + response.status;
    throw new Error(message);
  }
  return payload;
}

const server = new McpServer({ name: "unitx2-instagram-mcp", version: "0.1.0" });

server.tool(
  "instagram_get_profile",
  "Read the configured Instagram Professional account profile using Meta's official Graph API.",
  {},
  async () => {
    const profile = await graphGet(IG_USER_ID, {
      fields: "id,username,account_type,media_count"
    });
    return { content: [{ type: "text", text: JSON.stringify(profile, null, 2) }] };
  }
);

server.tool(
  "instagram_list_media",
  "List recent media metadata for the configured Instagram Professional account. Read-only; does not interact with other accounts.",
  { limit: z.number().int().min(1).max(25).default(10) },
  async ({ limit }) => {
    const result = await graphGet(IG_USER_ID + "/media", {
      fields: "id,caption,media_type,permalink,timestamp,thumbnail_url,media_url",
      limit: String(limit)
    });
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
