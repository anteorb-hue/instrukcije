# 👑 Admin Panel - Documentation

## 🎯 Što je implementirano

### ✅ Admin API Endpoints

**User Management:**
- List all users with advanced filters
- View detailed user profiles
- Update user information
- Verify/unverify tutors
- Delete users

**Analytics & Reports:**
- Platform overview statistics
- User growth metrics
- Revenue tracking
- Session completion rates
- Popular subjects and top tutors

**Rewards Management:**
- Manage reward catalog
- Create/update/delete rewards
- Configure point costs and values
- Set user role restrictions

---

## 📡 API Endpoints

### **User Management**

#### **GET /api/admin/users**
List all users sa advanced filtering.

**Query Parameters:**
```
?role=TUTOR
&verified=true
&search=john
&limit=50
&offset=0
&sortBy=createdAt
&sortOrder=desc
```

**Response:**
```json
{
  "users": [
    {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "TUTOR",
      "avatar": "...",
      "createdAt": "2024-01-01T00:00:00Z",
      "tutorProfile": {
        "verified": true,
        "hourlyRate": 50,
        "averageRating": 4.8,
        "totalSessions": 120,
        "_count": { "subjects": 3 }
      },
      "userPoints": {
        "totalPoints": 1500,
        "currentTier": "GOLD"
      },
      "_count": {
        "bookingsAsStudent": 5,
        "bookingsAsTutor": 120,
        "reviews": 10,
        "receivedReviews": 95
      }
    }
  ],
  "total": 500
}
```

---

#### **GET /api/admin/users/[id]**
Detailed user profile sa svim podacima.

**Response:**
```json
{
  "id": "...",
  "name": "...",
  "email": "...",
  "tutorProfile": {
    "verified": true,
    "subjects": [...],
    "availability": [...]
  },
  "bookingsAsStudent": [...],
  "bookingsAsTutor": [...],
  "receivedReviews": [...],
  "userPoints": {
    "transactions": [...],
    "rewards": [...]
  },
  "_count": {
    "materials": 15,
    "testsCreated": 8,
    "homeworkQuestions": 23,
    "homeworkAnswers": 87
  }
}
```

---

#### **PUT /api/admin/users/[id]**
Update user information.

**Body:**
```json
{
  "role": "TUTOR",
  "name": "Updated Name",
  "email": "newemail@example.com",
  "phone": "+385 91 234 5678",
  "bio": "Updated bio..."
}
```

---

#### **DELETE /api/admin/users/[id]**
Delete user (soft delete ili hard delete depending on config).

**Response:**
```json
{ "success": true }
```

---

#### **POST /api/admin/users/[id]/verify**
Verify ili unverify tutor.

**Body:**
```json
{
  "verified": true
}
```

**Response:**
```json
{
  "success": true,
  "verified": true
}
```

**Side Effects:**
- Šalje notifikaciju tutoru
- Šalje email tutoru
- Adds/removes verified badge

---

### **Analytics & Reports**

#### **GET /api/admin/analytics/overview**
Platform overview statistics.

**Query Parameters:**
```
?period=30  // days
```

**Response:**
```json
{
  "totals": {
    "users": 5000,
    "tutors": 1200,
    "students": 3500,
    "verifiedTutors": 800,
    "bookings": 15000,
    "completedSessions": 12000,
    "revenue": 500000,
    "materials": 2500,
    "tests": 800,
    "homeworkQuestions": 4500
  },
  "growth": {
    "period": 30,
    "newUsers": 150,
    "newBookings": 800,
    "newMaterials": 50,
    "newTests": 15,
    "newHomeworkQuestions": 200,
    "revenueInPeriod": 35000
  },
  "metrics": {
    "avgTutorRating": 4.6,
    "sessionCompletionRate": 80
  },
  "insights": {
    "popularSubjects": [
      {
        "subject": {
          "id": "...",
          "name": "Matematika",
          "category": "Exact Sciences"
        },
        "bookingsCount": 3500
      }
    ],
    "topTutors": [
      {
        "id": "...",
        "name": "...",
        "totalSessions": 250,
        "averageRating": 4.9,
        "verified": true
      }
    ]
  }
}
```

---

### **Rewards Management**

#### **GET /api/admin/rewards**
List all rewards u katalogu.

**Query Parameters:**
```
?type=DISCOUNT
&userRole=TUTOR
&active=true
```

**Response:**
```json
{
  "rewards": [
    {
      "id": "...",
      "type": "DISCOUNT",
      "title": "10% Popust na sljedeću rezervaciju",
      "description": "Koristi ovaj kupon...",
      "pointsCost": 500,
      "value": 10,
      "userRole": "STUDENT",
      "active": true,
      "limitPerUser": 3,
      "validDays": 30,
      "icon": "🎁",
      "imageUrl": "..."
    }
  ]
}
```

---

#### **POST /api/admin/rewards**
Create new reward.

**Body:**
```json
{
  "type": "DISCOUNT",
  "title": "10% Popust",
  "description": "10% popust na sljedeću rezervaciju",
  "pointsCost": 500,
  "value": 10,
  "userRole": "STUDENT",
  "active": true,
  "limitPerUser": 3,
  "validDays": 30,
  "icon": "🎁"
}
```

**Reward Types:**
- `DISCOUNT` - Popust u postotcima (value = %)
- `VOUCHER` - Voucher u eurima (value = €)
- `FEATURED` - Featured listing za tutore (value = days)
- `FREE_LESSON` - Besplatna lekcija (value = sessions)
- `PREMIUM` - Premium features (value = days)
- `COMMISSION_DISCOUNT` - Smanjena provizija za tutore (value = %)

---

#### **PUT /api/admin/rewards/[id]**
Update reward.

---

#### **DELETE /api/admin/rewards/[id]**
Delete reward from catalog.

---

## 💡 Usage Examples

### Frontend - Fetch Users

```typescript
const fetchUsers = async (filters: any) => {
  const params = new URLSearchParams({
    role: filters.role || '',
    verified: filters.verified?.toString() || '',
    search: filters.search || '',
    limit: '50',
    offset: '0',
  })

  const response = await fetch(`/api/admin/users?${params}`, {
    headers: {
      Authorization: `Bearer ${session.adminToken}`,
    },
  })

  const { users, total } = await response.json()
  return { users, total }
}
```

---

### Frontend - Verify Tutor

```typescript
const verifyTutor = async (tutorId: string, verified: boolean) => {
  const response = await fetch(`/api/admin/users/${tutorId}/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.adminToken}`,
    },
    body: JSON.stringify({ verified }),
  })

  const result = await response.json()

  if (result.success) {
    toast.success(
      verified ? 'Tutor verificiran!' : 'Verifikacija uklonjena!'
    )
  }
}
```

---

### Frontend - Fetch Analytics

```typescript
const fetchAnalytics = async (period: number = 30) => {
  const response = await fetch(
    `/api/admin/analytics/overview?period=${period}`,
    {
      headers: {
        Authorization: `Bearer ${session.adminToken}`,
      },
    }
  )

  const analytics = await response.json()

  // Display charts and metrics
  setTotalUsers(analytics.totals.users)
  setRevenue(analytics.totals.revenue)
  setGrowthRate(
    (analytics.growth.newUsers / analytics.totals.users) * 100
  )
}
```

---

### Frontend - Create Reward

```typescript
const createReward = async (rewardData: any) => {
  const response = await fetch('/api/admin/rewards', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.adminToken}`,
    },
    body: JSON.stringify({
      type: 'DISCOUNT',
      title: '10% Popust',
      description: '10% popust na sljedeću rezervaciju',
      pointsCost: 500,
      value: 10,
      userRole: 'STUDENT',
      active: true,
      limitPerUser: 3,
      validDays: 30,
    }),
  })

  const reward = await response.json()
  toast.success('Nagrada kreirana!')
}
```

---

## 📊 Admin Dashboard Features

### User Management Dashboard
```typescript
// Components:
- User list with filters (role, verified, search)
- User detail modal
- Verification toggle
- Ban/suspend user
- User activity timeline
- Total users widget
- New users (period) widget
- User growth chart
```

### Analytics Dashboard
```typescript
// Widgets:
- Total Revenue
- Total Sessions
- Active Users
- Session Completion Rate
- Revenue Chart (monthly/weekly/daily)
- User Growth Chart
- Popular Subjects Chart
- Top Tutors Leaderboard
- Geographic Distribution Map
```

### Rewards Dashboard
```typescript
// Components:
- Rewards catalog list
- Create reward modal
- Edit reward modal
- Activate/deactivate toggle
- Redemption statistics
- Most redeemed rewards
```

---

## 🔐 Security & Authorization

### Middleware Requirements
```typescript
// app/api/admin/middleware.ts
export async function middleware(req: Request) {
  const session = await getSession(req)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/admin/:path*',
}
```

### Admin Role Check
```typescript
// Check if user is admin
const isAdmin = session?.user?.role === 'ADMIN'

// Protect admin routes
if (!isAdmin) {
  return <Unauthorized />
}
```

---

## 📈 KPI Metrics to Track

### Platform Health
- Total Active Users
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- User Retention Rate
- Churn Rate

### Financial Metrics
- Total Revenue
- Monthly Recurring Revenue (MRR)
- Average Revenue Per User (ARPU)
- Revenue Growth Rate
- Commission per transaction

### Engagement Metrics
- Session Completion Rate
- Average Sessions per Tutor
- Average Sessions per Student
- Time to First Booking
- Tutor Response Time

### Content Metrics
- Total Materials Uploaded
- Total Tests Created
- Total Homework Questions
- Average Answers per Question
- Material Download Rate

---

## 🚧 TODO

- ❌ Add admin middleware for route protection
- ❌ Implement user ban/suspend functionality
- ❌ Add content moderation (reported content)
- ❌ Implement email marketing campaigns
- ❌ Add financial reports (CSV/PDF export)
- ❌ Create admin activity logs (audit trail)
- ❌ Add platform configuration settings
- ❌ Implement subject/category management
- ❌ Add tutor payout management
- ❌ Create automated reports (daily/weekly/monthly)

---

## 🛡️ Best Practices

### Data Privacy
- Admin should only access necessary user data
- Log all admin actions for audit trail
- Implement role-based access control (RBAC)
- Mask sensitive data (passwords, payment info)

### Performance
- Cache analytics data (Redis)
- Paginate all list endpoints
- Use database indexes for filters
- Implement rate limiting

### User Experience
- Provide clear feedback for actions
- Confirm destructive actions (delete, ban)
- Show loading states for analytics
- Export data to CSV/PDF for reports

---

Happy administrating! 👑🚀
