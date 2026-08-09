import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const pagesSchema = pgTable("pages", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", {
    length: 255,
  })
    .notNull()
    .default("Untitled Page"),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
