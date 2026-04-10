```javascript
/**
 * KorevelStorage — A mock drive/FTP/S3 storage engine
 * Dependencies: dexie, miragejs
 *
 * Usage:
 *   import { KorevelStorage } from './KorevelStorage'
 *   const storage = new KorevelStorage()
 *   await storage.init()
 */

import Dexie from 'dexie'

// ─── IndexedDB Schema via Dexie ──────────────────────────────────────────────

class KorevelDB extends Dexie {
  constructor() {
    super('KorevelStorageDB')
    this.version(1).stores({
      dirs:   '++id, guid, fileName, path, isDir, parentId, imageId, createdAt, updatedAt',
      images: '++id, image',
    })
    /** @type {Dexie.Table<import('./KorevelStorage').KorevelStorageFile>} */
    this.dirs   = this.table('dirs')
    /** @type {Dexie.Table<import('./KorevelStorage').KorevelStorageImage>} */
    this.images = this.table('images')
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

/**
 * Convert a File object (from FormData / <input type="file">) to a base64 string.
 * @param {File} file
 * @returns {Promise<string>} base64 data-URL string
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = () => resolve(reader.result)          // e.g. "data:image/png;base64,..."
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

/**
 * Trigger a browser download from a base64 data-URL.
 * @param {string} base64  Full data-URL (e.g. "data:image/png;base64,...")
 * @param {string} fileName
 */
export function downloadBase64(base64, fileName) {
  const a = document.createElement('a')
  a.href     = base64
  a.download = fileName
  a.click()
}

// ─── KorevelStorageTree ───────────────────────────────────────────────────────

/**
 * Convert a flat list of KorevelStorageFile entries into a nested tree.
 *
 * @typedef {{ id:number, guid:string, fileName:string, path:string,
 *             isDir:boolean, parentId:number|null, imageId?:number,
 *             createdAt:Date, updatedAt:Date, children?: KorevelTreeNode[] }} KorevelTreeNode
 *
 * @param {KorevelTreeNode[]} flatList
 * @param {number|null} rootParentId  parentId that is considered the root (default: 0)
 * @returns {KorevelTreeNode[]}
 */
export function KorevelStorageTree(flatList, rootParentId = 0) {
  const map = {}
  const roots = []

  // Index by id
  for (const item of flatList) {
    map[item.id] = { ...item, children: [] }
  }

  // Wire up parent → children
  for (const item of flatList) {
    const node = map[item.id]
    if (item.parentId == null || item.parentId === rootParentId) {
      roots.push(node)
    } else if (map[item.parentId]) {
      map[item.parentId].children.push(node)
    } else {
      // Orphan (parent not in list) — attach to roots
      roots.push(node)
    }
  }

  // Sort: folders first, then alphabetically
  const sortNodes = nodes => {
    nodes.sort((a, b) => {
      if (a.isDir !== b.isDir) return a.isDir ? -1 : 1
      return a.fileName.localeCompare(b.fileName)
    })
    for (const node of nodes) {
      if (node.children.length) sortNodes(node.children)
    }
    return nodes
  }

  return sortNodes(roots)
}

// ─── KorevelStorage ───────────────────────────────────────────────────────────

export class KorevelStorage {
  constructor() {
    this.db = new KorevelDB()
  }

  /** Open the database (called automatically if not yet open). */
  async init() {
    await this.db.open()
    return this
  }

  // ── Folders ────────────────────────────────────────────────────────────────

  /**
   * Create a new folder entry.
   * @param {string} folderName
   * @param {number} parentId  (0 = root)
   * @param {string} [parentPath='/']
   * @returns {Promise<KorevelStorageFile>}
   */
  async createFolder(folderName, parentId = 0, parentPath = '/') {
    const now  = new Date()
    const path = parentPath.endsWith('/')
      ? `${parentPath}${folderName}/`
      : `${parentPath}/${folderName}/`

    const entry = {
      guid:      generateGuid(),
      fileName:  folderName,
      path,
      isDir:     true,
      parentId,
      imageId:   undefined,
      createdAt: now,
      updatedAt: now,
    }
    const id = await this.db.dirs.add(entry)
    return { id, ...entry }
  }

  // ── Upload ─────────────────────────────────────────────────────────────────

  /**
   * Upload a single File (from an <input type="file"> or FormData).
   * @param {File}   file
   * @param {number} parentId   (0 = root)
   * @param {string} [parentPath='/']
   * @param {(progress: number) => void} [onProgress]  0–100
   * @returns {Promise<KorevelStorageFile>}
   */
  async upload(file, parentId = 0, parentPath = '/', onProgress) {
    onProgress?.(10)

    // Convert to base64
    const base64 = await fileToBase64(file)
    onProgress?.(60)

    // Store image blob
    const imageId = await this.db.images.add({ image: base64 })
    onProgress?.(80)

    const now  = new Date()
    const path = parentPath.endsWith('/')
      ? `${parentPath}${file.name}`
      : `${parentPath}/${file.name}`

    const entry = {
      guid:      generateGuid(),
      fileName:  file.name,
      path,
      isDir:     false,
      parentId,
      imageId,
      createdAt: now,
      updatedAt: now,
    }
    const id = await this.db.dirs.add(entry)
    onProgress?.(100)

    return { id, ...entry }
  }

  /**
   * Upload multiple files at once.
   * @param {File[]} files
   * @param {number} parentId
   * @param {string} [parentPath]
   * @param {(file: File, progress: number) => void} [onProgress]
   * @returns {Promise<KorevelStorageFile[]>}
   */
  async uploadBatch(files, parentId = 0, parentPath = '/', onProgress) {
    const results = []
    for (const file of files) {
      const entry = await this.upload(file, parentId, parentPath,
        p => onProgress?.(file, p))
      results.push(entry)
    }
    return results
  }

  // ── List ───────────────────────────────────────────────────────────────────

  /**
   * List all files/folders (flat), sorted: folders first then by name.
   * @param {{ page?: number, pageSize?: number }} [opts]
   * @returns {Promise<{ items: KorevelStorageFile[], total: number, page: number, pageSize: number }>}
   */
  async list({ page = 1, pageSize = 20 } = {}) {
    const all = await this.db.dirs
      .orderBy('fileName')
      .toArray()

    all.sort((a, b) => {
      if (a.isDir !== b.isDir) return a.isDir ? -1 : 1
      return a.fileName.localeCompare(b.fileName)
    })

    const total = all.length
    const offset = (page - 1) * pageSize
    const items  = all.slice(offset, offset + pageSize)

    return { items, total, page, pageSize }
  }

  /**
   * List entries under a specific parentId (one level), sorted: folders first.
   * @param {number} parentId
   * @param {{ page?: number, pageSize?: number }} [opts]
   */
  async listByParent(parentId = 0, { page = 1, pageSize = 20 } = {}) {
    const all = await this.db.dirs
      .where('parentId').equals(parentId)
      .toArray()

    all.sort((a, b) => {
      if (a.isDir !== b.isDir) return a.isDir ? -1 : 1
      return a.fileName.localeCompare(b.fileName)
    })

    const total = all.length
    const offset = (page - 1) * pageSize
    const items  = all.slice(offset, offset + pageSize)

    return { items, total, page, pageSize }
  }

  /**
   * Return the full tree starting from a given parentId.
   * @param {number} [rootParentId=0]
   * @returns {Promise<KorevelTreeNode[]>}
   */
  async listTree(rootParentId = 0) {
    const all = await this.db.dirs.toArray()
    return KorevelStorageTree(all, rootParentId)
  }

  // ── Download ───────────────────────────────────────────────────────────────

  /**
   * Fetch the base64 image for a file entry and trigger a browser download.
   * @param {number} fileId
   */
  async download(fileId) {
    const entry = await this.db.dirs.get(fileId)
    if (!entry) throw new Error(`File not found: ${fileId}`)
    if (entry.isDir) throw new Error('Cannot download a folder')
    if (!entry.imageId) throw new Error('No image data for this file')

    const img = await this.db.images.get(entry.imageId)
    if (!img) throw new Error('Image data missing')

    downloadBase64(img.image, entry.fileName)
    return entry
  }

  /**
   * Get the raw base64 string for a file (without triggering download).
   * @param {number} fileId
   * @returns {Promise<string>} base64 data-URL
   */
  async getBase64(fileId) {
    const entry = await this.db.dirs.get(fileId)
    if (!entry || !entry.imageId) throw new Error('File or image not found')
    const img = await this.db.images.get(entry.imageId)
    if (!img) throw new Error('Image data missing')
    return img.image
  }

  // ── Rename ─────────────────────────────────────────────────────────────────

  /**
   * Rename a file or folder.
   * @param {number} id
   * @param {string} newName
   * @returns {Promise<KorevelStorageFile>}
   */
  async rename(id, newName) {
    const entry = await this.db.dirs.get(id)
    if (!entry) throw new Error(`Entry not found: ${id}`)

    const oldSegments = entry.path.split('/')
    oldSegments[oldSegments.length - (entry.isDir ? 2 : 1)] = newName
    const newPath = oldSegments.join('/')

    const updates = { fileName: newName, path: newPath, updatedAt: new Date() }
    await this.db.dirs.update(id, updates)
    return { ...entry, ...updates }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────

  /**
   * Delete a file (and its image data) or an empty folder.
   * @param {number} id
   */
  async delete(id) {
    const entry = await this.db.dirs.get(id)
    if (!entry) throw new Error(`Entry not found: ${id}`)

    if (entry.isDir) {
      const children = await this.db.dirs.where('parentId').equals(id).count()
      if (children > 0) throw new Error('Cannot delete a non-empty folder')
    } else if (entry.imageId) {
      await this.db.images.delete(entry.imageId)
    }

    await this.db.dirs.delete(id)
  }

  // ── Search ─────────────────────────────────────────────────────────────────

  /**
   * Search files/folders by name (case-insensitive).
   * @param {string} query
   * @returns {Promise<KorevelStorageFile[]>}
   */
  async search(query) {
    const q = query.toLowerCase()
    return this.db.dirs
      .filter(e => e.fileName.toLowerCase().includes(q))
      .toArray()
  }

  // ── Stat ───────────────────────────────────────────────────────────────────

  /**
   * Get metadata for a single entry by id.
   * @param {number} id
   * @returns {Promise<KorevelStorageFile>}
   */
  async stat(id) {
    const entry = await this.db.dirs.get(id)
    if (!entry) throw new Error(`Entry not found: ${id}`)
    return entry
  }

  /** Clear all data (useful for tests / resets). */
  async clear() {
    await this.db.dirs.clear()
    await this.db.images.clear()
  }
}
```