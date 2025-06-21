import { pgTable, uuid, text, timestamp, uniqueIndex, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerkId").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [uniqueIndex("clerk_id_idx").on(t.clerkId)]);

export const groups = pgTable("groups", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  groupsId: uuid("groups_id").references(() => groups.id),
});

export const stockIns = pgTable("stock_ins", {
  id: uuid("id").primaryKey().defaultRandom(),
  value: integer("value").notNull(),
  productsId: uuid("products_id").references(() => products.id),
  authorsId: uuid("authors_id").references(()=> users.id)
});