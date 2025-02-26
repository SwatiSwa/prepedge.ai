import { pgTable, serial, integer, timestamp, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { mockTestTable } from "./MockTest";
import { questionBankTable } from ".";
  
  // Mock Test Questions 
export const mockTestQuestionTable = pgTable("mock_test_questions", {
    id: serial("id").primaryKey(),
    mockTestId: integer("mock_test_id").references(() => mockTestTable.id, { onDelete: "cascade" }).notNull(),
    questionId: integer("question_id").references(() => questionBankTable.id, { onDelete: "cascade" }).notNull(),
    order: integer("order").default(0), // Defines question sequence
});

export const mockTestQuestionSchema = createInsertSchema(mockTestQuestionTable);
export type MockTestQuestionSchema = z.infer<typeof mockTestQuestionSchema>;