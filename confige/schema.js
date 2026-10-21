import {
  pgTable,
  serial,
  varchar,
  integer,
  jsonb,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";


// 🟢 Users Table: DB snake_case columns ke sath exact mapping
export const Users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
  email: varchar('email', { length: 256 }).notNull(),
  imageUrl: varchar('image_url', { length: 256 }),
  subscription: boolean('subscription').default(false), // 👈 Ye exact hona chahiye
  subscriptionPlan: varchar('subscription_plan', { length: 50 }).default('free'),
  credits: integer('credits').default(100),
  paymentId: varchar('payment_id', { length: 255 }),
  orderId: varchar('order_id', { length: 255 }),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 🟢 Video Data Table (jsonb imported)
export const VideoData = pgTable("video_data", {
  id: serial("id").primaryKey(),
  script: jsonb("script").notNull(),
  audioFileUrl: varchar("audio_file_url", { length: 500 }).notNull(),
  captions: jsonb("captions").notNull(),
  imageList: jsonb("image_list").notNull(),
  createdBy: varchar("created_by", { length: 255 }).notNull(),
});