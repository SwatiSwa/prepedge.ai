import { pgTable, serial, varchar, timestamp, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
  
// Mock Tests
export const mockTestTable = pgTable("mock_tests", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    slug: varchar("slug", { length: 255 }).unique().notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});
  
export const mockTestSchema = createInsertSchema(mockTestTable);
export type MockTestSchema = z.infer<typeof mockTestSchema>;