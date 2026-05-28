ALTER TABLE "ad_image" ALTER COLUMN "id" SET DEFAULT uuidv7();--> statement-breakpoint
ALTER TABLE "ad" ADD COLUMN "published" boolean DEFAULT false;