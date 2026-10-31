# UNIT-X2 Instagram MCP

A small Model Context Protocol (MCP) server for **read-only access** to an Instagram Professional account through Meta's official Instagram Graph API.

This project does not scrape Instagram, automate likes/follows/comments/DMs, bypass platform limits, or request your Instagram password. It uses an access token supplied locally through an environment variable.

## Current tools

- \`instagram_get_profile\`: read the configured professional account's basic profile.
- \`instagram_list_media\`: list recent media metadata and permalinks.

No account-changing actions are exposed. Keep publishing and other account changes in Meta's official tools with a human reviewing each action.

## Requirements

- Node.js 20+
- An Instagram Professional (Business or Creator) account configured with Meta's supported Graph API setup
- A Meta app and an access token with the minimum permissions required by your app
- The Instagram Professional Account ID

Meta changes Graph API versions and permissions. Select a currently supported version in \`IG_GRAPH_API_VERSION\` and follow Meta's current documentation:
https://developers.facebook.com/docs/instagram-platform/

## Setup

\`\`\`bash
npm install
cp .env.example .env
\`\`\`

Set these values in your local environment or secret manager:

- \`IG_GRAPH_API_VERSION\` — for example, the currently supported version selected in your Meta app
- \`IG_USER_ID\` — Instagram Professional Account ID
- \`IG_ACCESS_TOKEN\` — token from Meta; never commit it or paste it into issues/chat

Run the MCP server over stdio:

\`\`\`bash
npm start
\`\`\`

Configure your MCP client to launch \`node\` with the absolute path to \`src/server.js\`. Pass the three environment variables through the client's secure environment configuration.

## Security

- Never commit \`.env\` or access tokens.
- Use the minimum scopes required and rotate/revoke tokens from Meta when exposed.
- Keep the token on your device/server; the MCP client should not send it as a tool argument.
- The server makes requests only to the configured official Graph API endpoints.
- This initial scaffold is read-only. It does not implement bulk engagement or unsolicited messaging.

## Development

\`\`\`bash
npm test
\`\`\`
