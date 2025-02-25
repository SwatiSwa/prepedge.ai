CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"mobile" varchar(10),
	"password" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
