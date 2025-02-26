import { pgTable, serial, varchar, timestamp, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const questionBankTable = pgTable("question_bank", {
    id: serial("id").primaryKey(),
    // authorId: uuid("author_id").references(() => users.id, { onDelete: "set null" }), // Tracks question creator
    questionType: varchar("question_type", { length: 50 }).notNull(), // mcq, video, audio, descriptive
    questionText: text("question_text").notNull(),
    mediaUrl: text("media_url"), // Stores video/audio URLs if applicable
    options: text("options"), // JSON string for MCQ options, NULL for other types
    correctAnswer: text("correct_answer"), // MCQ: JSON, Descriptive: text, Video/Audio: NULL
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    createdBy: varchar("created_by", { length: 255 }).notNull(),
    updatedBy: varchar("updated_by", { length: 255 }).notNull(),
  });
  
export const questionBankSchema = createInsertSchema(questionBankTable);
export type QuestionBankSchema = z.infer<typeof questionBankSchema>;