# 📝 Tests & Quizzes System - Documentation

## 🎯 Što je implementirano

### ✅ Prisma Database Models

**Test Model:**
- Svi tipovi testova sa fleksibilnim postavkama
- Time limits, passing score, shuffle questions
- Public/Private i Allow retake opcije
- Max attempts ograničenje
- Povezano sa tutorom, subjectom i education level-om

**Question Model (Question Bank):**
- 5 tipova pitanja: MULTIPLE_CHOICE, TRUE_FALSE, SHORT_ANSWER, ESSAY, FILL_IN_BLANK
- Reusable question bank - jedno pitanje može biti u više testova
- Points sistem po pitanju
- Tags za organizaciju
- Explanation polja za feedback

**QuestionOption Model:**
- Opcije za multiple choice pitanja
- isCorrect flag za auto-grading
- Order za prikaz

**TestQuestion Model:**
- Join table između Test i Question
- Omogućava reusable questions
- Point override za različite težine po testu

**TestSubmission Model:**
- Tracking svih pokušaja studenata
- Auto-grading za multiple choice i true/false
- Manual grading za essay i short answer
- Time tracking, IP address, attempt number

**SubmissionAnswer Model:**
- Pojedinačni odgovori unutar submission-a
- Auto-grading sa feedback-om
- Points tracking po pitanju

---

## 📡 API Endpoints

### **Tests Management**

#### **GET /api/tests**
List svih testova sa filterima.

**Query Parameters:**
```
?tutorId=xxx
&subjectId=xxx
&educationLevel=FAKULTET
&difficulty=MEDIUM
&search=react
&isPublic=true
&isActive=true
&limit=50
&offset=0
```

**Response:**
```json
{
  "tests": [
    {
      "id": "...",
      "title": "React Hooks Test",
      "description": "...",
      "difficulty": "MEDIUM",
      "timeLimit": 60,
      "passingScore": 70,
      "tutor": { "id": "...", "name": "...", "avatar": "..." },
      "subject": { "id": "...", "name": "Programiranje" },
      "_count": { "questions": 20, "submissions": 45 }
    }
  ],
  "total": 150,
  "limit": 50,
  "offset": 0
}
```

---

#### **POST /api/tests**
Kreiranje novog testa.

**Body:**
```json
{
  "tutorId": "user_xxx",
  "title": "React Hooks Test",
  "description": "Complete test on React Hooks",
  "instructions": "Answer all questions...",
  "subjectId": "subject_xxx",
  "educationLevel": "FAKULTET",
  "difficulty": "MEDIUM",
  "timeLimit": 60,
  "passingScore": 70,
  "shuffleQuestions": false,
  "showCorrectAnswers": true,
  "allowRetake": true,
  "maxAttempts": 3,
  "isPublic": true,
  "isActive": true,
  "questions": [
    {
      "questionId": "question_1",
      "order": 0,
      "pointOverride": 2
    }
  ]
}
```

---

#### **GET /api/tests/[id]**
Dohvaćanje pojedinačnog testa sa svim pitanjima.

**Response:**
```json
{
  "id": "...",
  "title": "...",
  "tutor": { ... },
  "subject": { ... },
  "questions": [
    {
      "id": "...",
      "order": 0,
      "pointOverride": 2,
      "question": {
        "id": "...",
        "questionText": "What is useState?",
        "type": "MULTIPLE_CHOICE",
        "points": 1,
        "options": [
          {
            "id": "...",
            "optionText": "A React Hook",
            "isCorrect": true,
            "order": 0
          }
        ]
      }
    }
  ]
}
```

---

#### **PUT /api/tests/[id]**
Ažuriranje testa.

**Body:**
```json
{
  "title": "Updated title",
  "difficulty": "HARD",
  "questions": [...]
}
```

---

#### **DELETE /api/tests/[id]**
Brisanje testa.

**Response:**
```json
{ "success": true }
```

---

### **Question Bank Management**

#### **GET /api/questions**
List svih pitanja u question bank-u.

**Query Parameters:**
```
?tutorId=xxx
&subjectId=xxx
&educationLevel=FAKULTET
&difficulty=MEDIUM
&type=MULTIPLE_CHOICE
&tag=hooks
&search=useState
&limit=50
&offset=0
```

**Response:**
```json
{
  "questions": [
    {
      "id": "...",
      "questionText": "What is useState?",
      "type": "MULTIPLE_CHOICE",
      "points": 1,
      "difficulty": "MEDIUM",
      "tags": ["react", "hooks"],
      "tutor": { ... },
      "subject": { ... },
      "options": [...],
      "_count": { "testsUsedIn": 5 }
    }
  ],
  "total": 200,
  "limit": 50,
  "offset": 0
}
```

---

#### **POST /api/questions**
Kreiranje novog pitanja.

**Body (Multiple Choice):**
```json
{
  "tutorId": "user_xxx",
  "questionText": "What is useState?",
  "type": "MULTIPLE_CHOICE",
  "points": 1,
  "options": [
    {
      "optionText": "A React Hook",
      "isCorrect": true,
      "order": 0
    },
    {
      "optionText": "A JavaScript function",
      "isCorrect": false,
      "order": 1
    }
  ],
  "explanation": "useState is a React Hook...",
  "subjectId": "subject_xxx",
  "educationLevel": "FAKULTET",
  "difficulty": "EASY",
  "tags": ["react", "hooks"]
}
```

**Body (True/False):**
```json
{
  "tutorId": "user_xxx",
  "questionText": "React is a library, not a framework",
  "type": "TRUE_FALSE",
  "points": 1,
  "correctAnswer": "true",
  "explanation": "React is indeed a library..."
}
```

**Body (Short Answer):**
```json
{
  "tutorId": "user_xxx",
  "questionText": "What does JSX stand for?",
  "type": "SHORT_ANSWER",
  "points": 2,
  "correctAnswer": "JavaScript XML",
  "explanation": "JSX stands for JavaScript XML..."
}
```

**Body (Essay):**
```json
{
  "tutorId": "user_xxx",
  "questionText": "Explain the concept of React Hooks...",
  "type": "ESSAY",
  "points": 10,
  "explanation": "Good answers should cover..."
}
```

---

#### **GET /api/questions/[id]**
Dohvaćanje pojedinačnog pitanja.

---

#### **PUT /api/questions/[id]**
Ažuriranje pitanja.

---

#### **DELETE /api/questions/[id]**
Brisanje pitanja.

---

### **Test Taking & Submissions**

#### **POST /api/tests/[id]/start**
Pokretanje testa (kreiranje submission-a).

**Body:**
```json
{
  "studentId": "user_xxx"
}
```

**Response:**
```json
{
  "id": "submission_xxx",
  "testId": "...",
  "studentId": "...",
  "attemptNumber": 1,
  "startedAt": "2024-01-01T10:00:00Z",
  "pointsPossible": 100,
  "test": {
    "title": "...",
    "timeLimit": 60,
    "questions": [...]
  }
}
```

---

#### **POST /api/tests/[id]/submit**
Predaja odgovora i auto-grading.

**Body:**
```json
{
  "submissionId": "submission_xxx",
  "timeSpent": 3600,
  "answers": [
    {
      "questionId": "question_1",
      "selectedOptionId": "option_a"
    },
    {
      "questionId": "question_2",
      "answerText": "JavaScript XML"
    }
  ]
}
```

**Response:**
```json
{
  "id": "...",
  "submittedAt": "2024-01-01T11:00:00Z",
  "timeSpent": 3600,
  "score": 85.5,
  "pointsEarned": 85.5,
  "pointsPossible": 100,
  "passed": true,
  "isGraded": true,
  "needsManualGrading": false,
  "answers": [...]
}
```

---

#### **GET /api/tests/[id]/submissions**
Lista submission-a za test.

**Query Parameters:**
```
?studentId=xxx
&isGraded=true
&limit=50
&offset=0
```

---

#### **GET /api/submissions/[id]**
Dohvaćanje pojedinačnog submission-a sa svim odgovorima.

**Response:**
```json
{
  "id": "...",
  "student": { ... },
  "test": { ... },
  "score": 85.5,
  "passed": true,
  "answers": [
    {
      "id": "...",
      "questionId": "...",
      "answerText": "...",
      "selectedOptionId": "...",
      "isCorrect": true,
      "pointsEarned": 2,
      "pointsPossible": 2,
      "feedback": "Correct!"
    }
  ]
}
```

---

#### **POST /api/submissions/[id]/grade**
Manual grading (za essay i short answer).

**Body:**
```json
{
  "gradedBy": "tutor_xxx",
  "feedback": "Great work overall!",
  "gradedAnswers": [
    {
      "answerId": "answer_1",
      "pointsEarned": 8,
      "isCorrect": true,
      "feedback": "Excellent explanation"
    }
  ]
}
```

**Response:**
```json
{
  "id": "...",
  "score": 90,
  "passed": true,
  "isGraded": true,
  "gradedAt": "2024-01-01T12:00:00Z",
  "gradedBy": "tutor_xxx",
  "feedback": "Great work overall!"
}
```

---

## 💡 Usage Examples

### Frontend - Create Question (Multiple Choice)

```typescript
const handleCreateQuestion = async () => {
  const response = await fetch('/api/questions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tutorId: session.user.id,
      questionText: 'What is useState?',
      type: 'MULTIPLE_CHOICE',
      points: 1,
      options: [
        { optionText: 'A React Hook', isCorrect: true, order: 0 },
        { optionText: 'A JavaScript function', isCorrect: false, order: 1 },
        { optionText: 'A CSS property', isCorrect: false, order: 2 },
      ],
      explanation: 'useState is a React Hook for state management',
      subjectId: 'subject_xxx',
      educationLevel: 'FAKULTET',
      difficulty: 'EASY',
      tags: ['react', 'hooks'],
    }),
  })

  const question = await response.json()
}
```

---

### Frontend - Create Test

```typescript
const handleCreateTest = async (questionIds: string[]) => {
  const response = await fetch('/api/tests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tutorId: session.user.id,
      title: 'React Hooks Test',
      description: 'Test your knowledge of React Hooks',
      instructions: 'Answer all questions. You have 60 minutes.',
      subjectId: 'subject_xxx',
      educationLevel: 'FAKULTET',
      difficulty: 'MEDIUM',
      timeLimit: 60,
      passingScore: 70,
      shuffleQuestions: true,
      showCorrectAnswers: true,
      allowRetake: true,
      maxAttempts: 3,
      isPublic: true,
      isActive: true,
      questions: questionIds.map((id, index) => ({
        questionId: id,
        order: index,
      })),
    }),
  })

  const test = await response.json()
}
```

---

### Frontend - Start Test

```typescript
const handleStartTest = async (testId: string) => {
  const response = await fetch(`/api/tests/${testId}/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      studentId: session.user.id,
    }),
  })

  const submission = await response.json()

  // Store submission ID and start timer
  setSubmissionId(submission.id)
  setStartTime(new Date(submission.startedAt))
  setQuestions(submission.test.questions)
}
```

---

### Frontend - Submit Test

```typescript
const handleSubmitTest = async (testId: string, submissionId: string, answers: any[]) => {
  const timeSpent = Math.floor((Date.now() - startTime.getTime()) / 1000)

  const response = await fetch(`/api/tests/${testId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      submissionId,
      timeSpent,
      answers: answers.map(a => ({
        questionId: a.questionId,
        answerText: a.answerText,
        selectedOptionId: a.selectedOptionId,
      })),
    }),
  })

  const result = await response.json()

  if (result.needsManualGrading) {
    alert('Your test has been submitted and is pending manual grading.')
  } else {
    alert(`Your score: ${result.score}%. ${result.passed ? 'Passed!' : 'Failed.'}`)
  }
}
```

---

### Frontend - Grade Submission (Tutor)

```typescript
const handleGradeSubmission = async (submissionId: string, gradedAnswers: any[]) => {
  const response = await fetch(`/api/submissions/${submissionId}/grade`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      gradedBy: session.user.id,
      feedback: 'Overall good work!',
      gradedAnswers: gradedAnswers.map(a => ({
        answerId: a.id,
        pointsEarned: a.pointsEarned,
        isCorrect: a.isCorrect,
        feedback: a.feedback,
      })),
    }),
  })

  const gradedSubmission = await response.json()
}
```

---

## 🎨 Question Types

### 1. **MULTIPLE_CHOICE**
- Opcije sa isCorrect flag-om
- Auto-graded
- Supports single correct answer

### 2. **TRUE_FALSE**
- correctAnswer = "true" ili "false"
- Auto-graded

### 3. **SHORT_ANSWER**
- correctAnswer za auto-grading (exact match)
- Ili manual grading ako correctAnswer nije postavljen

### 4. **ESSAY**
- Uvijek manual grading
- Više bodova (npr. 10 points)

### 5. **FILL_IN_BLANK**
- correctAnswer za auto-grading
- Ignoriše case i whitespace

---

## 📊 Features

✅ **Question Bank** - Reusable questions across multiple tests
✅ **5 Question Types** - Multiple choice, True/False, Short answer, Essay, Fill in blank
✅ **Auto-Grading** - Automatic for MC, T/F, and short answer with correct answer
✅ **Manual Grading** - For essays and complex short answers
✅ **Time Limits** - Optional time limits per test
✅ **Passing Score** - Customizable passing percentage
✅ **Shuffle Questions** - Randomize question order
✅ **Max Attempts** - Limit number of retakes
✅ **Detailed Analytics** - Points per question, time spent, attempt number
✅ **IP & User Agent Tracking** - Abuse prevention

---

## 🚧 TODO

- ❌ Integrate UI (tests/quizzes page) sa API-jem
- ❌ Implement question shuffling algorithm
- ❌ Add test preview mode for tutors
- ❌ Implement test scheduling (start/end dates)
- ❌ Add proctoring features (webcam, screen sharing)
- ❌ Add test analytics dashboard for tutors
- ❌ Implement question randomization from pool
- ❌ Add test categories/tags
- ❌ Implement test templates

---

## 🔐 Security Notes

- TODO: Add ownership validation in PUT/DELETE endpoints
- TODO: Validate student can only see their own submissions
- TODO: Validate tutor can only grade their own tests
- Time spent tracking for cheating detection
- IP address tracking for abuse prevention
- Max attempts to prevent infinite retries

---

## 🎓 Grading Logic

### Auto-Grading
- **Multiple Choice**: Checks if selectedOptionId.isCorrect === true
- **True/False**: Compares answerText (case-insensitive) to correctAnswer
- **Short Answer**: Exact match (case-insensitive, trimmed) if correctAnswer exists
- **Fill in Blank**: Same as short answer

### Manual Grading Required
- **Essay**: Always needs manual grading
- **Short Answer**: If no correctAnswer is set
- **Any Question**: If tutor wants to review

### Scoring
- Each question has `points` (default 1)
- Can be overridden per test with `pointOverride`
- Total score = (pointsEarned / pointsPossible) * 100
- Passed = score >= test.passingScore

---

Happy testing! 📝🎓
