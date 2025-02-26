CREATE TABLE "mock_test_questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"mock_test_id" integer NOT NULL,
	"question_id" integer NOT NULL,
	"order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "mock_tests" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"slug" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "mock_tests_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "mock_test_questions" ADD CONSTRAINT "mock_test_questions_mock_test_id_mock_tests_id_fk" FOREIGN KEY ("mock_test_id") REFERENCES "public"."mock_tests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mock_test_questions" ADD CONSTRAINT "mock_test_questions_question_id_question_bank_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."question_bank"("id") ON DELETE cascade ON UPDATE no action;