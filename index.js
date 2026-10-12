import { ensureSite, nginxReload, tlsStatus, listRoutes, domain } from './lib/nginx-ops.js'
import { registerJsonTool } from './lib/register-json-tool.js'

export const name = 'dsh-deploy-nginx'
export const inject = ['tools']

export function apply(ctx) {
  registerJsonTool(ctx, {
    name: 'nginx.ensure_site',
    description: `Ensure nginx site for ${domain()} exists, routes dir ready, then reload.`,
    parameters: {
      type: 'object',
      properties: { domain: { type: 'string' } },
      additionalProperties: false,
    },
    execute: async (args) => ensureSite(args),
  })
  registerJsonTool(ctx, {
    name: 'nginx.reload',
    description: 'nginx -t then systemctl reload nginx',
    parameters: { type: 'object', properties: {}, additionalProperties: false },
    execute: async () => nginxReload(),
  })
  registerJsonTool(ctx, {
    name: 'nginx.tls_status',
    description: 'Show Let\'s Encrypt cert expiry for DSH_DOMAIN',
    parameters: { type: 'object', properties: {}, additionalProperties: false },
    execute: async () => tlsStatus(),
  })
  registerJsonTool(ctx, {
    name: 'nginx.list_routes',
    description: 'List /etc/nginx/dsh-routes.d snippets',
    parameters: { type: 'object', properties: {}, additionalProperties: false },
    execute: async () => listRoutes(),
  })
  console.log('[dsh-deploy-nginx] tools registered')
}
