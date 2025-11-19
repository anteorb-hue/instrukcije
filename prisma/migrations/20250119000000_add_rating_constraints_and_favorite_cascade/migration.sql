-- Add foreign key constraint for favorites.tutorId with cascade delete
-- First check if constraint already exists (for idempotency)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'favorites_tutorId_fkey'
  ) THEN
    ALTER TABLE "favorites"
    ADD CONSTRAINT "favorites_tutorId_fkey"
    FOREIGN KEY ("tutorId")
    REFERENCES "users"("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE;
  END IF;
END $$;

-- Add index for tutorId in favorites (for better query performance)
CREATE INDEX IF NOT EXISTS "favorites_tutorId_idx" ON "favorites"("tutorId");

-- Add CHECK constraints for review ratings (1-5 range)
-- Main rating
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'reviews_rating_check'
  ) THEN
    ALTER TABLE "reviews"
    ADD CONSTRAINT "reviews_rating_check"
    CHECK (rating >= 1 AND rating <= 5);
  END IF;
END $$;

-- Communication rating
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'reviews_communication_check'
  ) THEN
    ALTER TABLE "reviews"
    ADD CONSTRAINT "reviews_communication_check"
    CHECK (communication IS NULL OR (communication >= 1 AND communication <= 5));
  END IF;
END $$;

-- Expertise rating
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'reviews_expertise_check'
  ) THEN
    ALTER TABLE "reviews"
    ADD CONSTRAINT "reviews_expertise_check"
    CHECK (expertise IS NULL OR (expertise >= 1 AND expertise <= 5));
  END IF;
END $$;

-- Punctuality rating
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'reviews_punctuality_check'
  ) THEN
    ALTER TABLE "reviews"
    ADD CONSTRAINT "reviews_punctuality_check"
    CHECK (punctuality IS NULL OR (punctuality >= 1 AND punctuality <= 5));
  END IF;
END $$;

-- Modify rating columns to use SmallInt for better storage efficiency
ALTER TABLE "reviews"
  ALTER COLUMN "rating" TYPE SMALLINT,
  ALTER COLUMN "communication" TYPE SMALLINT,
  ALTER COLUMN "expertise" TYPE SMALLINT,
  ALTER COLUMN "punctuality" TYPE SMALLINT;
