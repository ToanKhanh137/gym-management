-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "phone" TEXT,
    "dob" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "members" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "member_code" TEXT NOT NULL,
    "occupation" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "trainers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "speciality" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "trainers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "trainer_schedules" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "trainer_id" INTEGER NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    CONSTRAINT "trainer_schedules_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "trainers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "membership_packages" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "duration_days" INTEGER,
    "total_sessions" INTEGER,
    "price" REAL NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "member_id" INTEGER NOT NULL,
    "package_id" INTEGER NOT NULL,
    "start_date" TEXT NOT NULL,
    "end_date" TEXT,
    "sessions_total" INTEGER,
    "sessions_used" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "payment_method" TEXT NOT NULL,
    "amount_paid" REAL NOT NULL,
    "paid_at" DATETIME NOT NULL,
    "created_by_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "subscriptions_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "subscriptions_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "membership_packages" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "subscriptions_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "rooms" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "room_code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "capacity" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "equipment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "room_id" INTEGER,
    "equipment_code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "imported_at" TEXT,
    "warranty_until" TEXT,
    "origin" TEXT,
    "status" TEXT NOT NULL DEFAULT 'good',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "equipment_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "maintenance_requests" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "equipment_id" INTEGER NOT NULL,
    "reported_by_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reported_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" DATETIME,
    "resolved_by_id" INTEGER,
    CONSTRAINT "maintenance_requests_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "equipment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "maintenance_requests_reported_by_id_fkey" FOREIGN KEY ("reported_by_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "maintenance_requests_resolved_by_id_fkey" FOREIGN KEY ("resolved_by_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "training_logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "member_id" INTEGER NOT NULL,
    "subscription_id" INTEGER NOT NULL,
    "checked_in_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checked_out_at" DATETIME,
    "recorded_by_id" INTEGER NOT NULL,
    "notes" TEXT,
    CONSTRAINT "training_logs_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "training_logs_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "training_logs_recorded_by_id_fkey" FOREIGN KEY ("recorded_by_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "feedbacks" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "member_id" INTEGER NOT NULL,
    "target_type" TEXT NOT NULL,
    "target_id" INTEGER,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "feedbacks_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "feedbacks_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "members_user_id_key" ON "members"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "members_member_code_key" ON "members"("member_code");

-- CreateIndex
CREATE UNIQUE INDEX "trainers_user_id_key" ON "trainers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "rooms_room_code_key" ON "rooms"("room_code");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_equipment_code_key" ON "equipment"("equipment_code");
