```typescript
/**
 * KorevelStorage — MirageJS Server Setup (Backend Mock)
 *
 * Drop this into your app's entry point (main.js / index.js) BEFORE
 * any fetch calls are made so Mirage intercepts them first.
 *
 * Dependencies:  miragejs
 * Usage:         import { makeKorevelServer } from './korevel-server'
 *                makeKorevelServer()
 */

import { createServer, Model, RestSerializer } from 'miragejs'
import { KorevelStorage, KorevelStorageTree } from './KorevelStorage'

// Shared storage instance used by all route handlers
const storage = new KorevelStorage()
storage.init()

/**
 * Boot the Mirage server.
 * Call this once at application startup.
 *
 * @param {{ environment?: 'development'|'test' }} [opts]
 */
export function makeKorevelServer({ environment = 'development' } = {}) {
  return createServer({
    environment,

    // Mirage models (optional — just for Mirage's internal graph, not strictly needed
    // since we persist everything in Dexie ourselves)
    models: {
      dir:   Model,
      image: Model,
    },

    serializers: {
      application: RestSerializer,
    },

    // ── Seed (optional demo data) ────────────────────────────────────────────
    async seeds() {
      await storage.createFolder('Documents',  0, '/')
      await storage.createFolder('Pictures',   0, '/')
      await storage.createFolder('Work',       0, '/')
    },

    // ── Routes ───────────────────────────────────────────────────────────────
    routes() {
      this.namespace = 'api/storage'

      // ── POST /api/storage/upload ─────────────────────────────────────────
      // Body: FormData with key "file" and optional "parentId", "parentPath"
      this.post('/upload', async (schema, request) => {
        const formData  = request.requestBody          // FormData
        const file      = formData.get('file')
        const parentId  = Number(formData.get('parentId')  ?? 0)
        const parentPath = formData.get('parentPath') ?? '/'

        if (!file || typeof file === 'string') {
          return new Response(
            JSON.stringify({ error: 'No file provided' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          )
        }

        try {
          const entry = await storage.upload(file, parentId, parentPath)
          return entry
        } catch (err) {
          return new Response(
            JSON.stringify({ error: err.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          )
        }
      })

      // ── GET /api/storage/files?page=1&pageSize=20 ────────────────────────
      this.get('/files', async (schema, request) => {
        const { page = '1', pageSize = '20' } = request.queryParams
        return storage.list({ page: Number(page), pageSize: Number(pageSize) })
      })

      // ── GET /api/storage/files/:parentId?page=1&pageSize=20 ─────────────
      this.get('/files/:parentId', async (schema, request) => {
        const parentId = Number(request.params.parentId)
        const { page = '1', pageSize = '20' } = request.queryParams
        return storage.listByParent(parentId, {
          page: Number(page),
          pageSize: Number(pageSize),
        })
      })

      // ── GET /api/storage/tree?rootParentId=0 ────────────────────────────
      this.get('/tree', async (schema, request) => {
        const rootParentId = Number(request.queryParams.rootParentId ?? 0)
        const tree = await storage.listTree(rootParentId)
        return { tree }
      })

      // ── GET /api/storage/download/:id ───────────────────────────────────
      // Returns JSON with { base64, fileName } — front-end triggers download
      this.get('/download/:id', async (schema, request) => {
        const id = Number(request.params.id)
        try {
          const base64   = await storage.getBase64(id)
          const entry    = await storage.stat(id)
          return { base64, fileName: entry.fileName }
        } catch (err) {
          return new Response(
            JSON.stringify({ error: err.message }),
            { status: 404, headers: { 'Content-Type': 'application/json' } }
          )
        }
      })

      // ── PATCH /api/storage/rename/:id ────────────────────────────────────
      // Body: { newName: string }
      this.patch('/rename/:id', async (schema, request) => {
        const id      = Number(request.params.id)
        const { newName } = JSON.parse(request.requestBody)
        try {
          return storage.rename(id, newName)
        } catch (err) {
          return new Response(
            JSON.stringify({ error: err.message }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          )
        }
      })

      // ── DELETE /api/storage/files/:id ────────────────────────────────────
      this.del('/files/:id', async (schema, request) => {
        const id = Number(request.params.id)
        try {
          await storage.delete(id)
          return { ok: true }
        } catch (err) {
          return new Response(
            JSON.stringify({ error: err.message }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          )
        }
      })

      // ── POST /api/storage/folders ────────────────────────────────────────
      // Body: { folderName, parentId?, parentPath? }
      this.post('/folders', async (schema, request) => {
        const { folderName, parentId = 0, parentPath = '/' } =
          JSON.parse(request.requestBody)
        try {
          return storage.createFolder(folderName, parentId, parentPath)
        } catch (err) {
          return new Response(
            JSON.stringify({ error: err.message }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          )
        }
      })

      // ── GET /api/storage/search?q= ───────────────────────────────────────
      this.get('/search', async (schema, request) => {
        const { q = '' } = request.queryParams
        const results = await storage.search(q)
        return { items: results, total: results.length }
      })

      // ── GET /api/storage/stat/:id ────────────────────────────────────────
      this.get('/stat/:id', async (schema, request) => {
        const id = Number(request.params.id)
        try {
          return storage.stat(id)
        } catch (err) {
          return new Response(
            JSON.stringify({ error: err.message }),
            { status: 404, headers: { 'Content-Type': 'application/json' } }
          )
        }
      })

      // ── Passthrough any non-storage requests to the real network ─────────
      this.passthrough()
    },
  })
}
```