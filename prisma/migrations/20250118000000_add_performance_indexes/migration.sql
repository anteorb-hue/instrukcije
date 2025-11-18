-- Add indexes for performance optimization

-- User indexes
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"("email");
CREATE INDEX IF NOT EXISTS "User_role_idx" ON "User"("role");
CREATE INDEX IF NOT EXISTS "User_createdAt_idx" ON "User"("createdAt" DESC);

-- TutorProfile indexes
CREATE INDEX IF NOT EXISTS "TutorProfile_verified_idx" ON "TutorProfile"("verified");
CREATE INDEX IF NOT EXISTS "TutorProfile_userId_idx" ON "TutorProfile"("userId");

-- StudentProfile indexes
CREATE INDEX IF NOT EXISTS "StudentProfile_userId_idx" ON "StudentProfile"("userId");

-- Subject indexes
CREATE INDEX IF NOT EXISTS "Subject_category_idx" ON "Subject"("category");
CREATE INDEX IF NOT EXISTS "Subject_name_idx" ON "Subject"("name");

-- Material indexes
CREATE INDEX IF NOT EXISTS "Material_subjectId_idx" ON "Material"("subjectId");
CREATE INDEX IF NOT EXISTS "Material_type_idx" ON "Material"("type");
CREATE INDEX IF NOT EXISTS "Material_uploaderId_idx" ON "Material"("uploaderId");
CREATE INDEX IF NOT EXISTS "Material_createdAt_idx" ON "Material"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS "Material_downloads_idx" ON "Material"("downloads" DESC);

-- Test indexes
CREATE INDEX IF NOT EXISTS "Test_subjectId_idx" ON "Test"("subjectId");
CREATE INDEX IF NOT EXISTS "Test_difficulty_idx" ON "Test"("difficulty");
CREATE INDEX IF NOT EXISTS "Test_isPublic_idx" ON "Test"("isPublic");
CREATE INDEX IF NOT EXISTS "Test_isActive_idx" ON "Test"("isActive");
CREATE INDEX IF NOT EXISTS "Test_createdAt_idx" ON "Test"("createdAt" DESC);

-- Composite index for common test queries
CREATE INDEX IF NOT EXISTS "Test_public_active_idx" ON "Test"("isPublic", "isActive");

-- HomeworkQuestion indexes
CREATE INDEX IF NOT EXISTS "HomeworkQuestion_subjectId_idx" ON "HomeworkQuestion"("subjectId");
CREATE INDEX IF NOT EXISTS "HomeworkQuestion_status_idx" ON "HomeworkQuestion"("status");
CREATE INDEX IF NOT EXISTS "HomeworkQuestion_studentId_idx" ON "HomeworkQuestion"("studentId");
CREATE INDEX IF NOT EXISTS "HomeworkQuestion_createdAt_idx" ON "HomeworkQuestion"("createdAt" DESC);

-- HomeworkAnswer indexes
CREATE INDEX IF NOT EXISTS "HomeworkAnswer_questionId_idx" ON "HomeworkAnswer"("questionId");
CREATE INDEX IF NOT EXISTS "HomeworkAnswer_tutorId_idx" ON "HomeworkAnswer"("tutorId");
CREATE INDEX IF NOT EXISTS "HomeworkAnswer_createdAt_idx" ON "HomeworkAnswer"("createdAt" DESC);

-- Booking indexes
CREATE INDEX IF NOT EXISTS "Booking_studentId_idx" ON "Booking"("studentId");
CREATE INDEX IF NOT EXISTS "Booking_tutorId_idx" ON "Booking"("tutorId");
CREATE INDEX IF NOT EXISTS "Booking_subjectId_idx" ON "Booking"("subjectId");
CREATE INDEX IF NOT EXISTS "Booking_status_idx" ON "Booking"("status");
CREATE INDEX IF NOT EXISTS "Booking_scheduledAt_idx" ON "Booking"("scheduledAt" DESC);
CREATE INDEX IF NOT EXISTS "Booking_createdAt_idx" ON "Booking"("createdAt" DESC);

-- Composite index for upcoming bookings
CREATE INDEX IF NOT EXISTS "Booking_tutor_scheduled_idx" ON "Booking"("tutorId", "scheduledAt" DESC);
CREATE INDEX IF NOT EXISTS "Booking_student_scheduled_idx" ON "Booking"("studentId", "scheduledAt" DESC);

-- Payment indexes
CREATE INDEX IF NOT EXISTS "Payment_bookingId_idx" ON "Payment"("bookingId");
CREATE INDEX IF NOT EXISTS "Payment_status_idx" ON "Payment"("status");
CREATE INDEX IF NOT EXISTS "Payment_paidAt_idx" ON "Payment"("paidAt" DESC);

-- Review indexes
CREATE INDEX IF NOT EXISTS "Review_reviewerId_idx" ON "Review"("reviewerId");
CREATE INDEX IF NOT EXISTS "Review_reviewedUserId_idx" ON "Review"("reviewedUserId");
CREATE INDEX IF NOT EXISTS "Review_bookingId_idx" ON "Review"("bookingId");
CREATE INDEX IF NOT EXISTS "Review_rating_idx" ON "Review"("rating");
CREATE INDEX IF NOT EXISTS "Review_createdAt_idx" ON "Review"("createdAt" DESC);

-- Message indexes
CREATE INDEX IF NOT EXISTS "Message_senderId_idx" ON "Message"("senderId");
CREATE INDEX IF NOT EXISTS "Message_receiverId_idx" ON "Message"("receiverId");
CREATE INDEX IF NOT EXISTS "Message_read_idx" ON "Message"("read");
CREATE INDEX IF NOT EXISTS "Message_createdAt_idx" ON "Message"("createdAt" DESC);

-- Composite index for unread messages
CREATE INDEX IF NOT EXISTS "Message_receiver_unread_idx" ON "Message"("receiverId", "read", "createdAt" DESC);

-- Notification indexes
CREATE INDEX IF NOT EXISTS "Notification_userId_idx" ON "Notification"("userId");
CREATE INDEX IF NOT EXISTS "Notification_read_idx" ON "Notification"("read");
CREATE INDEX IF NOT EXISTS "Notification_createdAt_idx" ON "Notification"("createdAt" DESC);

-- UserPoints indexes
CREATE INDEX IF NOT EXISTS "UserPoints_userId_idx" ON "UserPoints"("userId");

-- RewardCatalog indexes
CREATE INDEX IF NOT EXISTS "RewardCatalog_type_idx" ON "RewardCatalog"("type");
CREATE INDEX IF NOT EXISTS "RewardCatalog_userRole_idx" ON "RewardCatalog"("userRole");
CREATE INDEX IF NOT EXISTS "RewardCatalog_active_idx" ON "RewardCatalog"("active");
CREATE INDEX IF NOT EXISTS "RewardCatalog_pointsCost_idx" ON "RewardCatalog"("pointsCost");
