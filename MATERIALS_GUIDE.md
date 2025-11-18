# 📚 Learning Materials System - Documentation

## 🎯 Što je implementirano

### ✅ Prisma Database Models

**Material Model:**
- Svi tipovi materijala: VIDEO, PDF, DOCUMENT, PRESENTATION, IMAGE, AUDIO, ARCHIVE
- Povezano sa tutorom, subjectom i education level-om
- Public/Private i Free/Paid opcije
- View i download tracking
- Tags za filtriranje

**MaterialTag Model:**
- Many-to-many relacija sa Material modelom
- Fleksibilno tagiranje

**MaterialView & MaterialDownload Models:**
- Analytics i tracking view-ova i download-ova
- IP adresa i user agent tracking
- Povezano sa user-om (ako je authenticated)

---

## 📡 API Endpoints

### **GET /api/materials**
List svih materijala sa filterima.

**Query Parameters:**
```
?type=VIDEO
&subjectId=xxx
&tutorId=xxx
&educationLevel=FAKULTET
&search=react
&isPublic=true
&isFree=true
&tag=programming
&limit=50
&offset=0
```

**Response:**
```json
{
  "materials": [
    {
      "id": "...",
      "title": "React Hooks Tutorial",
      "description": "...",
      "type": "VIDEO",
      "fileUrl": "https://res.cloudinary.com/...",
      "fileName": "react-hooks.mp4",
      "fileSize": 45000000,
      "mimeType": "video/mp4",
      "tutor": { "id": "...", "name": "...", "avatar": "..." },
      "subject": { "id": "...", "name": "Programiranje" },
      "tags": [{ "tag": "react" }, { "tag": "hooks" }],
      "viewCount": 234,
      "downloadCount": 45,
      "_count": { "views": 234, "downloads": 45 }
    }
  ],
  "total": 150,
  "limit": 50,
  "offset": 0
}
```

---

### **POST /api/materials**
Kreiranje novog materijala.

**Body:**
```json
{
  "tutorId": "user_xxx",
  "title": "React Hooks Tutorial",
  "description": "Complete guide to React Hooks",
  "type": "VIDEO",
  "fileUrl": "https://res.cloudinary.com/...",
  "fileName": "react-hooks.mp4",
  "fileSize": 45000000,
  "mimeType": "video/mp4",
  "subjectId": "subject_xxx",
  "educationLevel": "FAKULTET",
  "tags": ["react", "hooks", "javascript"],
  "isPublic": true,
  "isFree": true,
  "duration": 1800
}
```

---

### **GET /api/materials/[id]**
Dohvaćanje pojedinačnog materijala.

**Response:**
```json
{
  "id": "...",
  "title": "...",
  "tutor": {
    "id": "...",
    "name": "...",
    "tutorProfile": {
      "title": "...",
      "verified": true
    }
  },
  ...
}
```

---

### **PUT /api/materials/[id]**
Ažuriranje materijala.

**Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "tags": ["new", "tags"]
}
```

---

### **DELETE /api/materials/[id]**
Brisanje materijala.

**Response:**
```json
{ "success": true }
```

---

### **POST /api/materials/[id]/view**
Tracking view-a.

**Body:**
```json
{
  "userId": "user_xxx" // optional
}
```

**Response:**
```json
{ "success": true }
```

---

### **POST /api/materials/[id]/download**
Tracking download-a i vraćanje download URL-a.

**Body:**
```json
{
  "userId": "user_xxx" // optional
}
```

**Response:**
```json
{
  "success": true,
  "downloadUrl": "https://res.cloudinary.com/...",
  "fileName": "react-hooks.mp4"
}
```

---

## 📤 File Upload

### **POST /api/materials/upload**
Upload file-a na Cloudinary.

**Content-Type:** `multipart/form-data`

**Body:**
- `file`: File to upload (max 100MB)

**Response:**
```json
{
  "success": true,
  "file": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "instrukcije/materials/xxx",
    "fileName": "react-hooks.mp4",
    "fileSize": 45000000,
    "mimeType": "video/mp4",
    "type": "VIDEO",
    "duration": 1800
  }
}
```

### **GET /api/materials/upload/signature**
Dohvaćanje Cloudinary signature-a za client-side upload.

**Response:**
```json
{
  "signature": "xxx",
  "timestamp": 1234567890,
  "apiKey": "xxx",
  "cloudName": "xxx"
}
```

---

## 🛠️ Setup

### 1. Environment Variables

Dodaj u `.env`:

```env
# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 2. Database Migration

```bash
npx prisma migrate dev --name add_learning_materials
```

### 3. Install Dependencies

```bash
npm install cloudinary
```

---

## 💡 Usage Examples

### Frontend - Upload File

```typescript
const handleFileUpload = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/materials/upload', {
    method: 'POST',
    body: formData,
  })

  const { file: uploadedFile } = await response.json()

  // Now create material with uploaded file info
  await fetch('/api/materials', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tutorId: session.user.id,
      title: 'My Material',
      ...uploadedFile,
    }),
  })
}
```

### Frontend - List Materials

```typescript
const fetchMaterials = async () => {
  const response = await fetch('/api/materials?type=VIDEO&limit=20')
  const { materials, total } = await response.json()
  setMaterials(materials)
}
```

### Frontend - Track View

```typescript
const trackView = async (materialId: string) => {
  await fetch(`/api/materials/${materialId}/view`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: session?.user?.id }),
  })
}
```

### Frontend - Download Material

```typescript
const downloadMaterial = async (materialId: string) => {
  const response = await fetch(`/api/materials/${materialId}/download`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: session?.user?.id }),
  })

  const { downloadUrl, fileName } = await response.json()

  // Trigger download
  const link = document.createElement('a')
  link.href = downloadUrl
  link.download = fileName
  link.click()
}
```

---

## 🎨 Material Types

- **VIDEO** - Video lekcije (mp4, avi, mov...)
- **PDF** - PDF dokumenti
- **DOCUMENT** - Word dokumenti (.doc, .docx)
- **PRESENTATION** - PowerPoint prezentacije (.ppt, .pptx)
- **IMAGE** - Slike (jpg, png, svg...)
- **AUDIO** - Audio zapisi (mp3, wav...)
- **ARCHIVE** - ZIP/RAR arhive
- **OTHER** - Ostali tipovi

---

## 📊 Features

✅ **File Upload** - Cloudinary integration
✅ **Multiple Material Types** - Video, PDF, Documents, Images...
✅ **View & Download Tracking** - Analytics
✅ **Tagging System** - Flexible tags
✅ **Free/Paid Materials** - Monetization support
✅ **Public/Private** - Visibility control
✅ **Subject & Education Level** - Categorization
✅ **File Size Limits** - Max 100MB per file

---

## 🚧 TODO

- ❌ Integrate UI (materials page) sa API-jem
- ❌ Implement paid materials payment flow
- ❌ Add video player component
- ❌ Add PDF viewer component
- ❌ Implement favorites/bookmarks
- ❌ Add material comments/ratings

---

## 🔐 Security Notes

- File upload ima max size limit (100MB)
- TODO: Dodati ownership validation u PUT/DELETE
- TODO: Dodati payment check za paid materials
- Cloudinary automatski skenira za malware
- IP i user agent tracking za abuse prevention

---

Happy uploading! 📚🚀
