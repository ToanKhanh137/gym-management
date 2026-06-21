ALTER TABLE "feedbacks"
ADD COLUMN "status" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN "response" TEXT,
ADD COLUMN "resolved_at" TIMESTAMP(3),
ADD COLUMN "resolved_by_id" INTEGER;

CREATE TABLE "subscription_renewals" (
    "id" SERIAL NOT NULL,
    "subscription_id" INTEGER NOT NULL,
    "previous_end_date" TEXT,
    "new_end_date" TEXT,
    "added_sessions" INTEGER,
    "payment_method" TEXT NOT NULL,
    "amount_paid" DOUBLE PRECISION NOT NULL,
    "renewed_by_id" INTEGER NOT NULL,
    "renewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "subscription_renewals_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "staff_schedules" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    CONSTRAINT "staff_schedules_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "promotions" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "discount_percent" INTEGER,
    "start_date" TEXT NOT NULL,
    "end_date" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "promotions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "staff_schedules_user_id_day_of_week_key"
ON "staff_schedules"("user_id", "day_of_week");

ALTER TABLE "feedbacks"
ADD CONSTRAINT "feedbacks_resolved_by_id_fkey"
FOREIGN KEY ("resolved_by_id") REFERENCES "users"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "subscription_renewals"
ADD CONSTRAINT "subscription_renewals_subscription_id_fkey"
FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "subscription_renewals"
ADD CONSTRAINT "subscription_renewals_renewed_by_id_fkey"
FOREIGN KEY ("renewed_by_id") REFERENCES "users"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "staff_schedules"
ADD CONSTRAINT "staff_schedules_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
