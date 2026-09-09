ALTER TABLE "ad" ALTER COLUMN "published_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "ad" ALTER COLUMN "published_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "profile" DROP COLUMN "tel";