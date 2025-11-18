# 📚 Homework Help System - Documentation

## 🎯 Što je implementirano

### ✅ Prisma Database Models

**HomeworkQuestion Model:**
- Student postavlja pitanja vezana uz domaće zadaće
- Attachments (slike, PDFi, dokumenti)
- Subject i education level kategorije
- Status tracking (OPEN, ANSWERED, CLOSED)
- Assignment to specific tutor
- Accepted answer označavanje
- View tracking

**HomeworkAnswer Model:**
- Odgovori od tutora ili drugih studenata
- Voting sistem (upvote/downvote)
- Helpful flag za prihvaćene odgovore
- Attachments support

**AnswerVote Model:**
- Upvote/Downvote tracking
- Jedan user = jedan vote po odgovoru
- Toggle voting (remove vote by clicking again)

---

## 📡 API Endpoints

### **Homework Questions**

#### **GET /api/homework**
List svih homework pitanja sa filterima.

**Query Parameters:**
```
?studentId=xxx
&subjectId=xxx
&educationLevel=FAKULTET
&status=OPEN
&assignedTutorId=xxx
&tag=algebra
&search=kvadratna
&limit=50
&offset=0
```

**Response:**
```json
{
  "questions": [
    {
      "id": "...",
      "title": "Kvadratna jednadžba - pomoć",
      "description": "Ne razumijem kako riješiti...",
      "attachments": ["https://..."],
      "status": "OPEN",
      "tags": ["matematika", "algebra"],
      "viewCount": 45,
      "student": { "id": "...", "name": "...", "avatar": "..." },
      "subject": { "id": "...", "name": "Matematika" },
      "assignedTutor": { "id": "...", "name": "..." },
      "acceptedAnswer": null,
      "_count": { "answers": 3 }
    }
  ],
  "total": 150,
  "limit": 50,
  "offset": 0
}
```

---

#### **POST /api/homework**
Kreiranje novog homework pitanja.

**Body:**
```json
{
  "studentId": "user_xxx",
  "title": "Kvadratna jednadžba - pomoć",
  "description": "Imam problem sa riješavanjem kvadratne jednadžbe x² + 5x + 6 = 0. Kako da je riješim?",
  "attachments": ["https://cloudinary.com/image.jpg"],
  "subjectId": "subject_xxx",
  "educationLevel": "SREDNJA_SKOLA",
  "tags": ["matematika", "algebra", "kvadratna-jednadžba"],
  "assignedTutorId": "tutor_xxx"
}
```

**Response:**
```json
{
  "id": "question_xxx",
  "title": "...",
  "student": { ... },
  "subject": { ... },
  "assignedTutor": { ... },
  "createdAt": "2024-01-01T10:00:00Z"
}
```

**Side Effects:**
- Šalje notifikaciju assigned tutoru
- Šalje email tutoru

---

#### **GET /api/homework/[id]**
Dohvaćanje pojedinačnog homework pitanja sa svim odgovorima.

**Response:**
```json
{
  "id": "...",
  "title": "...",
  "description": "...",
  "attachments": [...],
  "status": "ANSWERED",
  "viewCount": 45,
  "student": { ... },
  "subject": { ... },
  "assignedTutor": { ... },
  "acceptedAnswer": {
    "id": "...",
    "content": "...",
    "author": { ... }
  },
  "answers": [
    {
      "id": "...",
      "content": "...",
      "voteCount": 5,
      "isHelpful": true,
      "author": {
        "id": "...",
        "name": "...",
        "role": "TUTOR",
        "avatar": "..."
      },
      "_count": { "votes": 5 }
    }
  ]
}
```

---

#### **PUT /api/homework/[id]**
Ažuriranje homework pitanja.

**Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "CLOSED",
  "assignedTutorId": "new_tutor_xxx"
}
```

---

#### **DELETE /api/homework/[id]**
Brisanje homework pitanja.

**Response:**
```json
{ "success": true }
```

---

### **Answers**

#### **GET /api/homework/[id]/answers**
Lista odgovora za homework pitanje.

**Response:**
```json
{
  "answers": [
    {
      "id": "...",
      "content": "Kvadratnu jednadžbu rješavaš ovako...",
      "voteCount": 5,
      "isHelpful": true,
      "attachments": [],
      "author": {
        "id": "...",
        "name": "Ivan Horvat",
        "role": "TUTOR",
        "tutorProfile": {
          "verified": true
        }
      },
      "createdAt": "2024-01-01T10:30:00Z"
    }
  ],
  "total": 5
}
```

---

#### **POST /api/homework/[id]/answers**
Kreiranje novog odgovora.

**Body:**
```json
{
  "authorId": "user_xxx",
  "content": "Kvadratnu jednadžbu možeš riješiti pomoću formule...",
  "attachments": ["https://cloudinary.com/solution.jpg"]
}
```

**Response:**
```json
{
  "id": "answer_xxx",
  "content": "...",
  "author": { ... },
  "createdAt": "2024-01-01T10:30:00Z"
}
```

**Side Effects:**
- Šalje notifikaciju studentu koji je postavio pitanje
- Šalje email studentu

---

#### **POST /api/homework/[id]/accept**
Prihvaćanje odgovora kao rješenja (samo student koji je postavio pitanje).

**Body:**
```json
{
  "answerId": "answer_xxx"
}
```

**Response:**
```json
{
  "id": "question_xxx",
  "status": "ANSWERED",
  "acceptedAnswer": {
    "id": "answer_xxx",
    "content": "...",
    "isHelpful": true,
    "author": { ... }
  }
}
```

**Side Effects:**
- Označava odgovor kao `isHelpful: true`
- Mijenja status pitanja na `ANSWERED`
- Šalje notifikaciju autoru odgovora
- Šalje email autoru odgovora

---

#### **POST /api/homework/[id]/view**
Tracking pregleda pitanja.

**Response:**
```json
{ "success": true }
```

---

### **Answer Operations**

#### **GET /api/homework/answers/[id]**
Dohvaćanje pojedinačnog odgovora.

---

#### **PUT /api/homework/answers/[id]**
Ažuriranje odgovora.

**Body:**
```json
{
  "content": "Updated answer content",
  "attachments": ["https://..."]
}
```

---

#### **DELETE /api/homework/answers/[id]**
Brisanje odgovora.

**Side Effects:**
- Ako je ovo prihvaćeni odgovor, uklanja ga iz pitanja
- Mijenja status pitanja natrag na `OPEN`

---

### **Voting**

#### **POST /api/homework/answers/[id]/vote**
Vote na odgovor (upvote/downvote).

**Body:**
```json
{
  "userId": "user_xxx",
  "vote": 1  // 1 for upvote, -1 for downvote
}
```

**Response:**
```json
{
  "action": "created",  // "created", "updated", "removed"
  "vote": 1
}
```

**Behavior:**
- First vote: Creates vote
- Same vote again: Removes vote (toggle)
- Different vote: Updates vote (-1 to +1 or +1 to -1)
- Updates `voteCount` na HomeworkAnswer

---

#### **DELETE /api/homework/answers/[id]/vote**
Uklanjanje vote-a.

**Query Parameters:**
```
?userId=xxx
```

---

## 💡 Usage Examples

### Frontend - Create Question

```typescript
const handleAskQuestion = async () => {
  const response = await fetch('/api/homework', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      studentId: session.user.id,
      title: 'Kvadratna jednadžba - pomoć',
      description: 'Imam problem sa riješavanjem x² + 5x + 6 = 0...',
      attachments: uploadedFiles,
      subjectId: 'math_subject_id',
      educationLevel: 'SREDNJA_SKOLA',
      tags: ['matematika', 'algebra'],
      assignedTutorId: selectedTutorId,
    }),
  })

  const question = await response.json()
}
```

---

### Frontend - List Questions

```typescript
const fetchHomeworkQuestions = async () => {
  const response = await fetch(
    '/api/homework?status=OPEN&subjectId=math_subject_id&limit=20'
  )
  const { questions, total } = await response.json()
  setQuestions(questions)
}
```

---

### Frontend - Answer Question

```typescript
const handleSubmitAnswer = async (questionId: string, content: string) => {
  const response = await fetch(`/api/homework/${questionId}/answers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      authorId: session.user.id,
      content,
      attachments: uploadedFiles,
    }),
  })

  const answer = await response.json()
}
```

---

### Frontend - Accept Answer

```typescript
const handleAcceptAnswer = async (questionId: string, answerId: string) => {
  const response = await fetch(`/api/homework/${questionId}/accept`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answerId }),
  })

  const updatedQuestion = await response.json()
}
```

---

### Frontend - Vote on Answer

```typescript
const handleVote = async (answerId: string, vote: 1 | -1) => {
  const response = await fetch(`/api/homework/answers/${answerId}/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: session.user.id,
      vote,
    }),
  })

  const result = await response.json()

  if (result.action === 'removed') {
    // Vote was toggled off
    console.log('Vote removed')
  } else if (result.action === 'created') {
    // New vote created
    console.log('Voted:', result.vote)
  } else {
    // Vote updated
    console.log('Vote changed to:', result.vote)
  }
}
```

---

### Frontend - Track View

```typescript
const trackQuestionView = async (questionId: string) => {
  await fetch(`/api/homework/${questionId}/view`, {
    method: 'POST',
  })
}

// Call when user opens question page
useEffect(() => {
  trackQuestionView(questionId)
}, [questionId])
```

---

## 🎨 Question Statuses

### **OPEN**
- Novo pitanje bez odgovora
- Ili pitanje sa odgovorima ali bez prihvaćenog rješenja

### **ANSWERED**
- Pitanje ima prihvaćeni odgovor
- Student je označio odgovor kao rješenje

### **CLOSED**
- Student je zatvorio pitanje bez prihvaćanja odgovora
- Ili admin/moderator je zatvorio pitanje

---

## 📊 Features

✅ **Q&A Platform** - Students ask, tutors/students answer
✅ **Voting System** - Upvote/downvote answers
✅ **Accepted Answers** - Student marks best answer
✅ **Attachments** - Images, PDFs, documents
✅ **Assign to Tutor** - Direct questions to specific tutors
✅ **Notifications** - Email + in-app notifications
✅ **Status Tracking** - OPEN, ANSWERED, CLOSED
✅ **View Counting** - Track question popularity
✅ **Tags** - Categorize questions
✅ **Subject & Level** - Filter by subject and education level

---

## 🔔 Notification System Integration

### **New Question Assigned to Tutor**
```typescript
// Automatically sent when question is created with assignedTutorId
Notification Type: 'homework_question_assigned'
Email Subject: 'Nova domaća zadaća - {title}'
```

### **New Answer Received**
```typescript
// Sent to student when someone answers their question
Notification Type: 'homework_answer_received'
Email Subject: 'Novi odgovor - {title}'
```

### **Answer Accepted**
```typescript
// Sent to answer author when their answer is accepted
Notification Type: 'answer_accepted'
Email Subject: 'Odgovor prihvaćen - {title}'
```

---

## 🚧 TODO

- ❌ Integrate UI (homework/Q&A page) sa API-jem
- ❌ Add file upload component for attachments
- ❌ Implement rich text editor for answers (Markdown/HTML)
- ❌ Add question search with full-text search
- ❌ Implement question bounties (points system)
- ❌ Add reputation system for helpful tutors
- ❌ Implement question following/watching
- ❌ Add duplicate question detection
- ❌ Create homework analytics for tutors

---

## 🔐 Security Notes

- TODO: Add ownership validation (only student can update/delete their question)
- TODO: Add authorization (only question author can accept answers)
- TODO: Validate attachments (file type, size limits)
- TODO: Implement spam detection
- TODO: Add rate limiting for question creation
- View tracking for analytics and trending questions

---

## 💡 Best Practices

### For Students
1. Be specific in question title
2. Provide context and what you've tried
3. Attach relevant images/files
4. Accept helpful answers to close question
5. Assign to specific tutor if you need targeted help

### For Tutors
1. Provide detailed, educational answers
2. Include step-by-step explanations
3. Add visual aids when helpful
4. Encourage students to think, don't just give answers
5. Ask clarifying questions if needed

### For Platform
1. Encourage upvoting helpful answers
2. Show accepted answers first
3. Highlight verified tutors
4. Track and reward helpful contributors
5. Close old unanswered questions

---

Happy helping! 📚✨
