CREATE TABLE "profile" (
	"id" text PRIMARY KEY NOT NULL,
	"updated_at" timestamp NOT NULL,
	"full_name" text,
	"tel" text[],
	"messengers" jsonb,
	"address" text,
	"description" text
);
--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_id_user_id_fk" FOREIGN KEY ("id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;