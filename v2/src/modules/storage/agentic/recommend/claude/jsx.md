```javascript
/**
 * KorevelStorage — Front-End Usage Examples (React)
 *
 * This file shows:
 *  1. Direct usage via the KorevelStorage class (no network)
 *  2. Usage via the Mirage REST API (fetch)
 *  3. Tree rendering example
 *  4. A ready-to-use <KorevelFileBrowser> React component
 */

import React, { useEffect, useState, useRef } from 'react'
import { KorevelStorage, KorevelStorageTree, downloadBase64 } from './KorevelStorage'
import { makeKorevelServer } from './korevel-server'

// ─── 1. Boot Mirage at app entry (do this ONCE in main.jsx / index.js) ───────

// makeKorevelServer()   ← uncomment in your entry point


// ─── 2. Direct class usage (no HTTP) ─────────────────────────────────────────

async function directUsageExample() {
  const storage = new KorevelStorage()
  await storage.init()

  // Create folders
  const docs = await storage.createFolder('Documents', 0, '/')
  const pics = await storage.createFolder('Pictures',  0, '/')
  console.log('Folder created:', docs)

  // Upload a file from an <input type="file"> change event
  async function handleInputChange(event) {
    const file = event.target.files[0]
    const entry = await storage.upload(file, docs.id, docs.path, progress => {
      console.log(`Upload progress: ${progress}%`)
    })
    console.log('Uploaded:', entry)
  }

  // List root (flat, paginated)
  const { items, total } = await storage.list({ page: 1, pageSize: 10 })
  console.log(`${total} total items, first page:`, items)

  // List one folder's children
  const { items: docsChildren } = await storage.listByParent(docs.id)
  console.log('Items in Documents:', docsChildren)

  // Full tree
  const tree = await storage.listTree(0)
  console.log('Tree:', JSON.stringify(tree, null, 2))

  // Download a file (triggers browser download)
  if (items.length > 0) {
    const fileEntry = items.find(i => !i.isDir)
    if (fileEntry) await storage.download(fileEntry.id)
  }

  // Rename
  await storage.rename(docs.id, 'My Documents')

  // Delete a file
  // await storage.delete(someFileId)
}


// ─── 3. Fetch / REST API usage (via Mirage) ───────────────────────────────────

async function apiUsageExample() {
  // Upload via FormData
  async function uploadFile(file, parentId = 0, parentPath = '/') {
    const formData = new FormData()
    formData.append('file',       file)
    formData.append('parentId',   String(parentId))
    formData.append('parentPath', parentPath)

    const res = await fetch('/api/storage/upload', {
      method: 'POST',
      body:   formData,
    })
    return res.json()
  }

  // List all (flat, paginated)
  async function listFiles(page = 1, pageSize = 20) {
    const res = await fetch(`/api/storage/files?page=${page}&pageSize=${pageSize}`)
    return res.json()   // { items, total, page, pageSize }
  }

  // List by parent folder
  async function listFolder(parentId, page = 1) {
    const res = await fetch(`/api/storage/files/${parentId}?page=${page}`)
    return res.json()
  }

  // Fetch tree
  async function getTree(rootParentId = 0) {
    const res = await fetch(`/api/storage/tree?rootParentId=${rootParentId}`)
    const { tree } = await res.json()
    return tree
  }

  // Download (fetch base64 → trigger download)
  async function downloadFile(id) {
    const res = await fetch(`/api/storage/download/${id}`)
    const { base64, fileName } = await res.json()
    downloadBase64(base64, fileName)
  }

  // Rename
  async function renameFile(id, newName) {
    const res = await fetch(`/api/storage/rename/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newName }),
    })
    return res.json()
  }

  // Create folder
  async function createFolder(folderName, parentId = 0, parentPath = '/') {
    const res = await fetch('/api/storage/folders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folderName, parentId, parentPath }),
    })
    return res.json()
  }

  // Delete
  async function deleteEntry(id) {
    const res = await fetch(`/api/storage/files/${id}`, { method: 'DELETE' })
    return res.json()
  }

  // Search
  async function search(query) {
    const res = await fetch(`/api/storage/search?q=${encodeURIComponent(query)}`)
    return res.json()   // { items, total }
  }
}


// ─── 4. KorevelStorageTree standalone example ────────────────────────────────

function treeExample() {
  const flat = [
    { id: 1, parentId: 0,    fileName: 'Documents', isDir: true  },
    { id: 2, parentId: 0,    fileName: 'Pictures',  isDir: true  },
    { id: 3, parentId: 1,    fileName: 'resume.pdf', isDir: false },
    { id: 4, parentId: 1,    fileName: 'Work',      isDir: true  },
    { id: 5, parentId: 4,    fileName: 'project.docx', isDir: false },
    { id: 6, parentId: 2,    fileName: 'photo.jpg', isDir: false },
  ]

  const tree = KorevelStorageTree(flat, 0)
  /*
  Result:
  [
    { id:1, fileName:'Documents', isDir:true, children:[
        { id:4, fileName:'Work', isDir:true, children:[
            { id:5, fileName:'project.docx', ... }
          ]
        },
        { id:3, fileName:'resume.pdf', ... }
      ]
    },
    { id:2, fileName:'Pictures', isDir:true, children:[
        { id:6, fileName:'photo.jpg', ... }
      ]
    }
  ]
  */
  return tree
}


// ─── 5. Ready-to-use React component ─────────────────────────────────────────

export function KorevelFileBrowser() {
  const [storage]      = useState(() => new KorevelStorage())
  const [ready, setReady]       = useState(false)
  const [items, setItems]       = useState([])
  const [currentParent, setCurrentParent] = useState(0)
  const [breadcrumb, setBreadcrumb] = useState([{ id: 0, name: 'Root' }])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [page, setPage]         = useState(1)
  const [total, setTotal]       = useState(0)
  const [renaming, setRenaming] = useState(null)   // { id, value }
  const [newFolderName, setNewFolderName] = useState('')
  const fileInputRef = useRef()
  const PAGE_SIZE = 10

  useEffect(() => {
    storage.init().then(() => {
      setReady(true)
      loadFolder(0)
    })
  }, [])

  async function loadFolder(parentId, p = 1) {
    const { items: list, total: t } =
      await storage.listByParent(parentId, { page: p, pageSize: PAGE_SIZE })
    setItems(list)
    setTotal(t)
    setPage(p)
    setCurrentParent(parentId)
  }

  function navigateTo(id, name) {
    setBreadcrumb(prev => [...prev, { id, name }])
    loadFolder(id)
  }

  function navigateBreadcrumb(index) {
    const crumb = breadcrumb[index]
    setBreadcrumb(prev => prev.slice(0, index + 1))
    loadFolder(crumb.id)
  }

  async function handleUpload(e) {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    const parent = breadcrumb[breadcrumb.length - 1]
    const parentPath = breadcrumb.map(b => b.name === 'Root' ? '' : b.name).join('/') + '/'

    for (const file of files) {
      await storage.upload(file, currentParent, parentPath, p => setUploadProgress(p))
    }
    setUploading(false)
    setUploadProgress(0)
    loadFolder(currentParent, page)
  }

  async function handleCreateFolder() {
    if (!newFolderName.trim()) return
    const parentPath = breadcrumb.map(b => b.name === 'Root' ? '' : b.name).join('/') + '/'
    await storage.createFolder(newFolderName.trim(), currentParent, parentPath)
    setNewFolderName('')
    loadFolder(currentParent, page)
  }

  async function handleDownload(item) {
    await storage.download(item.id)
  }

  async function handleRename(id) {
    if (!renaming?.value?.trim()) return
    await storage.rename(id, renaming.value.trim())
    setRenaming(null)
    loadFolder(currentParent, page)
  }

  async function handleDelete(id) {
    if (!confirm('Delete this item?')) return
    await storage.delete(id)
    loadFolder(currentParent, page)
  }

  if (!ready) return <div>Initializing storage…</div>

  return (
    <div style={{ fontFamily: 'monospace', padding: 16 }}>
      <h2>Korevel Storage</h2>

      {/* Breadcrumb */}
      <div style={{ marginBottom: 12 }}>
        {breadcrumb.map((crumb, i) => (
          <span key={crumb.id}>
            <button onClick={() => navigateBreadcrumb(i)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#0070f3', textDecoration: 'underline' }}>
              {crumb.name}
            </button>
            {i < breadcrumb.length - 1 && ' / '}
          </span>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          style={{ display: 'none' }}
          onChange={handleUpload}
        />
        <button onClick={() => fileInputRef.current.click()} disabled={uploading}>
          {uploading ? `Uploading… ${uploadProgress}%` : '⬆ Upload'}
        </button>

        <input
          value={newFolderName}
          onChange={e => setNewFolderName(e.target.value)}
          placeholder="New folder name"
          onKeyDown={e => e.key === 'Enter' && handleCreateFolder()}
          style={{ padding: '4px 8px' }}
        />
        <button onClick={handleCreateFolder}>+ Folder</button>
      </div>

      {/* File list */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>
            <th style={{ padding: '6px 8px' }}>Name</th>
            <th style={{ padding: '6px 8px' }}>Type</th>
            <th style={{ padding: '6px 8px' }}>Modified</th>
            <th style={{ padding: '6px 8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '6px 8px' }}>
                {renaming?.id === item.id ? (
                  <>
                    <input
                      value={renaming.value}
                      onChange={e => setRenaming(r => ({ ...r, value: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && handleRename(item.id)}
                      autoFocus
                    />
                    <button onClick={() => handleRename(item.id)}>✓</button>
                    <button onClick={() => setRenaming(null)}>✕</button>
                  </>
                ) : (
                  <span
                    style={{ cursor: item.isDir ? 'pointer' : 'default', color: item.isDir ? '#0070f3' : 'inherit' }}
                    onClick={() => item.isDir && navigateTo(item.id, item.fileName)}
                  >
                    {item.isDir ? '📁' : '📄'} {item.fileName}
                  </span>
                )}
              </td>
              <td style={{ padding: '6px 8px' }}>{item.isDir ? 'Folder' : 'File'}</td>
              <td style={{ padding: '6px 8px' }}>{new Date(item.updatedAt).toLocaleString()}</td>
              <td style={{ padding: '6px 8px', display: 'flex', gap: 4 }}>
                <button onClick={() => setRenaming({ id: item.id, value: item.fileName })}>✏️</button>
                {!item.isDir && (
                  <button onClick={() => handleDownload(item)}>⬇️</button>
                )}
                <button onClick={() => handleDelete(item.id)}>🗑️</button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr><td colSpan={4} style={{ padding: 16, textAlign: 'center', color: '#999' }}>Empty folder</td></tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {total > PAGE_SIZE && (
        <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
          <button disabled={page === 1} onClick={() => loadFolder(currentParent, page - 1)}>◀ Prev</button>
          <span>Page {page} / {Math.ceil(total / PAGE_SIZE)}</span>
          <button disabled={page >= Math.ceil(total / PAGE_SIZE)} onClick={() => loadFolder(currentParent, page + 1)}>Next ▶</button>
        </div>
      )}
    </div>
  )
}

export default KorevelFileBrowser
```