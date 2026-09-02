ALTER TABLE "ad" ADD COLUMN "status" text DEFAULT 'DRAFT' NOT NULL;--> statement-breakpoint
ALTER TABLE "ad" DROP COLUMN "isPublished";