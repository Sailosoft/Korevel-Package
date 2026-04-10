To handle the tree structure transformation, we can implement a specific utility class. Since your data relies on `parentId` and `id` pointers, we can use a recursive approach or a map-based reference approach (which is more efficient) to build the hierarchy.

Here is the implementation for `KorevelStorageTree`.

---

## 1. The Tree Interface

We need a new interface that extends your existing `KorevelStorageFile` to include a children array.

```typescript
interface KorevelStorageNode extends KorevelStorageFile {
  children: KorevelStorageNode[];
}
```

---

## 2. KorevelStorageTree Class

This class takes a flat array (from your `listFiles` method) and reconstructs the nested tree.

```typescript
export class KorevelStorageTree {
  /**
   * Converts a flat list of files/folders into a hierarchical tree
   * @param flatList The array of KorevelStorageFile from the database
   * @param rootId The ID to start building from (defaults to 0 for root)
   */
  static toTree(flatList: KorevelStorageFile[], rootId: number = 0): KorevelStorageNode[] {
    const map: { [key: number]: KorevelStorageNode } = {};
    const tree: KorevelStorageNode[] = [];

    // First pass: Initialize the map with all items and empty children arrays
    flatList.forEach((item) => {
      map[item.id] = { ...item, children: [] };
    });

    // Second pass: Connect children to parents
    flatList.forEach((item) => {
      const node = map[item.id];

      if (item.parentId === rootId) {
        // If it belongs to the root level we are looking for
        tree.push(node);
      } else if (map[item.parentId]) {
        // If the parent exists in our map, push to parent's children
        map[item.parentId].children.push(node);
      }
    });

    // Sort: Folders first, then alphabetically
    return this.sortTree(tree);
  }

  /**
   * Helper to recursively sort the tree
   */
  private static sortTree(nodes: KorevelStorageNode[]): KorevelStorageNode[] {
    return nodes
      .sort((a, b) => {
        if (a.isDir === b.isDir) return a.fileName.localeCompare(b.fileName);
        return a.isDir ? -1 : 1;
      })
      .map((node) => ({
        ...node,
        children: node.children.length > 0 ? this.sortTree(node.children) : [],
      }));
  }
}
```

---

## 3. Usage Example

### Backend (MirageJS Integration)

You can now add an endpoint that returns the full tree structure instead of just a flat list.

```typescript
// Inside your MirageJS setup
this.get('/files/tree', async () => {
  // 1. Get every single file from Dexie
  const allFiles = await db.files.toArray();

  // 2. Convert to tree
  return KorevelStorageTree.toTree(allFiles);
});
```

### Frontend (UI Rendering)

This is particularly useful for building a sidebar navigation or a recursive folder component.

```typescript
const fetchDirectoryTree = async () => {
  const response = await fetch('/api/files/tree');
  const treeData: KorevelStorageNode[] = await response.json();

  renderTreeView(treeData);
};

// Example of a recursive render function (Pseudo-code)
function renderTreeView(nodes: KorevelStorageNode[]) {
  nodes.forEach(node => {
    console.log(`${node.isDir ? '📁' : '📄'} ${node.fileName}`);
    if (node.children.length > 0) {
      renderTreeView(node.children); // Recurse
    }
  });
}
```

---

## Why this approach?

* **Performance:** Using a `map` for the transformation means we only iterate through the list twice ($O(n)$), which is much faster than nested loops for large file systems.
* **Consistency:** It reuses the "Folders First" logic across all levels of the tree.
* **Flexibility:** You can pass a different `rootId` to `toTree()` if you want to generate a tree view starting from a specific subdirectory rather than the entire drive.
