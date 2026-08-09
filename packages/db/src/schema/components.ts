import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { pagesSchema } from "./pages.js";

export const componentsSchema = pgTable("components", {
  id: uuid("id").defaultRandom().primaryKey(),

  pageId: uuid("page_id")
    .notNull()
    .references(() => pagesSchema.id, {
      onDelete: "cascade",
    }),

  type: varchar("type", {
    length: 50,
  }).notNull(),

  content: text("content"),

  sortOrder: integer("sort_order").notNull().default(0),

  styles: jsonb("styles").$type<Record<string, unknown>>().default({}),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
