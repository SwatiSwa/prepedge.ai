CREATE TABLE "question_bank" (
	"id" serial PRIMARY KEY NOT NULL,
	"question_type" varchar(50) NOT NULL,
	"question_text" text NOT NULL,
	"media_url" text,
	"options" text,
	"correct_answer" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"created_by" varchar(255) NOT NULL,
	"updated_by" varchar(255) NOT NULL
);
