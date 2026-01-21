import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

// Sanity env vars
import { apiVersion, dataset, projectId } from './sanity/env'
import { schema } from './sanity/schemaTypes'
import { structure } from './sanity/structure'
import { AdminTool } from './sanity/plugins/AdminTool'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,

  schema,

  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],

  tools: [
    {
      name: 'admin-app',
      title: 'Admin App',
      component: AdminTool,
    },
  ],
})