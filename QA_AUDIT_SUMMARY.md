# QA AUDIT SUMMARY - INSTRUKCIJE API

**Date:** 2025-11-19  
**Total Endpoints Audited:** 50+  
**Total Issues Found:** 30  

---

## CRITICAL ISSUES (Must Fix Immediately)

### 🔴 Issue #1: Hardcoded Mock User ID in Favorites
- **File:** `/api/favorites/route.ts`
- **Impact:** Data breach - anyone can access any user's favorites
- **Effort:** 15 minutes
```
const userId = 'mock-user-id' // Replace with session auth
```

### 🔴 Issue #2: No Auth on View Tracking
- **File:** `/api/homework/[id]/view/route.ts`
- **Impact:** Bot spam, fake analytics
- **Effort:** 10 minutes

### 🔴 Issue #3: No Auth on Answer Voting
- **Files:** `/api/homework/answers/[id]/vote/route.ts`
- **Impact:** Vote manipulation, broken reputation system
- **Effort:** 15 minutes
```
const { userId, vote } = body // User-provided, not verified!
```

### 🔴 Issue #4: Unauthenticated Homework Creation
- **File:** `/api/homework/route.ts POST`
- **Impact:** Spam, user impersonation
- **Effort:** 10 minutes

### 🔴 Issue #5: No Auth on Subject Creation
- **File:** `/api/subjects/route.ts POST`
- **Impact:** Data pollution, curriculum vandalism
- **Effort:** 5 minutes (add @withAdmin)

### 🔴 Issue #6: No Auth on Question Creation
- **File:** `/api/questions/route.ts POST`
- **Impact:** Tutor impersonation, quality issues
- **Effort:** 10 minutes

---

## HIGH PRIORITY ISSUES (Fix This Week)

### 🟠 Issue #7: Missing Authorization Checks
**Files:** 
- `/api/homework/[id]/route.ts` PUT/DELETE - No ownership check
- `/api/homework/answers/[id]/route.ts` PUT/DELETE - No ownership check
- `/api/tests/[id]/submit/route.ts` - No submission ownership verification

**Impact:** Users can modify/delete others' content  
**Effort:** 30 minutes

### 🟠 Issue #8: Missing Test Access Verification
- **File:** `/api/tests/[id]/start/route.ts`
- **Impact:** Free access to paid content, revenue loss
- **Effort:** 20 minutes

### 🟠 Issue #9: Price Validation Missing
- **File:** `/api/payments/route.ts POST`
- **Impact:** Financial fraud, price manipulation
- **Effort:** 15 minutes

### 🟠 Issue #10: Performance - No Pagination
- **File:** `/api/tutors/route.ts GET`
- **Impact:** Memory exhaustion, slow responses
- **Effort:** 20 minutes

### 🟠 Issue #11: Race Condition on Max Attempts
- **File:** `/api/tests/[id]/start/route.ts`
- **Impact:** Users can exceed attempt limits
- **Effort:** 15 minutes (use transaction)

### 🟠 Issue #12: Commented-out Delete Check
- **File:** `/api/admin/users/[id]/route.ts DELETE`
- **Impact:** Data integrity issues
- **Effort:** 2 minutes (uncomment)

### 🟠 Issue #13: N+1 Queries
- **Files:** `/api/admin/users/route.ts`, `/api/tutors/route.ts`
- **Impact:** Slow queries, poor scalability
- **Effort:** 45 minutes

---

## MEDIUM PRIORITY ISSUES (Fix Next Month)

1. **No Input Validation** (reviews, questions, etc.) - 30 min
2. **No File Type Validation** (uploads) - 20 min
3. **No Rate Limiting** (messages) - 30 min
4. **Memory Issues** (large file uploads) - 45 min
5. **Insufficient Error Handling** (webhook) - 15 min

---

## QUICK FIXES (< 5 Minutes Each)

| Issue | File | Fix |
|-------|------|-----|
| Hardcoded user ID | `/api/favorites/route.ts` | Add session auth |
| Commented check | `/api/admin/users/[id]/route.ts` | Uncomment 3 lines |
| Missing @withAdmin | `/api/subjects/route.ts` POST | Wrap with decorator |
| Missing @withAdmin | `/api/questions/route.ts` POST | Wrap with decorator |

---

## CRITICAL PATH (Priority Order)

### Day 1 (2-3 hours)
```
1. Fix Issue #1: Favorites auth bypass
2. Fix Issue #2: View tracking auth
3. Fix Issue #3: Voting auth
4. Fix Issue #4: Homework creation auth
5. Fix Issue #5: Subject creation auth
6. Fix Issue #6: Question creation auth
```

### Day 2-3 (4-5 hours)
```
7. Fix Issue #7: Homework/answer authorization
8. Fix Issue #8: Test access verification
9. Fix Issue #9: Price validation
10. Fix Issue #12: Delete protection
11. Fix Issue #11: Race condition
```

### Week 2
```
12. Fix Issue #10: Pagination
13. Fix Issue #13: N+1 queries
14. Add input validation
15. Add file type validation
16. Add rate limiting
```

---

## TESTING CHECKLIST

After fixes, test:

- [ ] Unauthenticated requests return 401
- [ ] Cross-user access is blocked (403)
- [ ] Non-admin cannot access admin endpoints
- [ ] Users cannot modify others' content
- [ ] Prices are validated correctly
- [ ] Rate limits work
- [ ] File uploads validate MIME types
- [ ] Pagination works with large datasets
- [ ] Concurrent operations are handled safely

---

## SUMMARY STATISTICS

| Category | Count |
|----------|-------|
| Authentication Issues | 6 |
| Authorization Issues | 9 |
| Input Validation Issues | 5 |
| Performance Issues | 4 |
| Race Conditions | 2 |
| Data Integrity Issues | 4 |

**Estimated Total Fix Time:** 20-25 hours

---

## FILES MOST AFFECTED

1. `/api/favorites/route.ts` - 3 issues
2. `/api/homework/[id]/route.ts` - 3 issues
3. `/api/homework/answers/[id]/route.ts` - 3 issues
4. `/api/tests/[id]/start/route.ts` - 2 issues
5. `/api/homework/[id]/view/route.ts` - 1 issue
6. `/api/homework/answers/[id]/vote/route.ts` - 1 issue
7. `/api/payments/route.ts` - 2 issues
8. `/api/tutors/route.ts` - 2 issues

---

## NEXT STEPS

1. **Review this report** with the team (30 min)
2. **Create tickets** for each issue (1 hour)
3. **Prioritize fixes** based on severity (30 min)
4. **Assign to developers** (30 min)
5. **Set deadline** for critical fixes: **This Week**

