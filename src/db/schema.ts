import { relations } from "drizzle-orm";
import { pgTable, uuid, text, timestamp, uniqueIndex, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  role: text("role").default("user").notNull(),
  email: text("email").notNull(),
  clerkId: text("clerkId").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [uniqueIndex("clerk_id_idx").on(t.clerkId)]);

export const userRelations = relations(users, ({ many }) => ({
  stockIns: many(stockIns),
}));

export const groups = pgTable("groups", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
});

export const groupRelations = relations(groups, ({ many }) => ({
  products: many(products),
}));

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  groupId: uuid("group_id").references(() => groups.id, {
    onDelete: "set null"
  }),
});

export const productRelations = relations(products, ({ one }) => ({
  group: one(groups, {
    fields: [products.groupId],
    references: [groups.id],
  }),
}));

export const stockIns = pgTable("stock_ins", {
  id: uuid("id").primaryKey().defaultRandom(),
  quantity: integer("quantity").notNull(),
  productId: uuid("product_id").notNull().references(() => products.id, {
    onDelete: "cascade"
  }),
  userId: uuid("user_id").notNull().references(()=> users.id, {
    onDelete: "cascade"
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),  
});

export const stockInRelations = relations(stockIns, ({ one }) => ({
  product: one(products, {
    fields: [stockIns.productId],
    references: [products.id]
  }),
  user: one(users, {
    fields: [stockIns.userId],
    references: [users.id]
  })
}))

export const stockOuts = pgTable("stock_outs", {
  id: uuid("id").primaryKey().defaultRandom(),
  quantity: integer("quantity").notNull(),
  productId: uuid("product_id").notNull().references(() => products.id, {
    onDelete: "cascade",
  }),
  userId: uuid("user_id").notNull().references(() => users.id, {
    onDelete: "cascade"
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const stockOutsRelations = relations(stockOuts, ({ one }) => ({
  product: one(products, {
    fields: [stockOuts.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [stockOuts.userId],
    references: [users.id]
  })
}))