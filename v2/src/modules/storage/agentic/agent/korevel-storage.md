# Korevel Storage
- Korevel Storage is an application that mocks storage server similar of those drive and ftp. Application runs with miragejs that catches fetch and mocking software app.

- It uses dexieJS to store base64 of the image. the KorevelStorage can fetch the file and download in the browser.

- Korevel Storage can do:
  - Upload
  - List Of Files
  - Pagination
  - List of Files (Tree Mode Via ParentId)
  - List of Files on Specific Parent Id(Tree Mode)
  - list folder first before file
  - Download Files
  - It support upload loading and processing
  - rename file names

- It will act as a drive, s3 or ftp file.

## Interfaces
```typescript
// here the list of korevelStorage functionality
interface KorevelStorage {}

interface KorevelStorageFile {
  id: number;
  guid: string; // guid
  fileName: string;
  path: string;
  isDir: boolean;
  parentId: number;
  imageId?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface KorevelStorageImage {
  id: number;
  image: string; // base 64 image
}

```

## Dependency
- MirageJS


# Instruction
- Create me a KorevelStorage class
- This capable to convert formdata.file to base64
- It has the capacity to store dexiejs indexdb
- It has capacity to list all files and capable to download it

# Example
- Give example of to use it on front-end
- Give example how to setup it on backend


# Append
## Feature Request
- Add functionality KorevelStorageTree that can convert flat list to custom tree view with parent and children