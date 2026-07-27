CREATE TABLE "newsletter_subscribers" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"source" text DEFAULT 'website' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "newsletter_subscribers_email_unique" UNIQUE("email")
);
