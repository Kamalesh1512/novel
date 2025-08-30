import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  decimal,
  integer,
  boolean,
  uuid,
  primaryKey,
  varchar,
  date,
  json,
} from "drizzle-orm/pg-core";

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email").unique().notNull(),
  emailVerified: timestamp("email_verified"),
  image: text("image"),
  password: text("password"),
  role: text("role").default("customer").notNull(),
  status: text("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  phoneNumber: text("phone_number").unique(),
  phoneNumberVerified: boolean("phone_number_verified")
    .default(false)
    .notNull(),
  phoneOtp: text("phone_otp"),
  phoneOtpExpiresAt: timestamp("phone_otp_expires_at"),
  lastLoginAt: timestamp("last_login_at"),
  razorpayCustomerId: varchar("razorpay_customer_id"),
  accountSettings: text("account_settings"),
});

// Admin roles table for granular permissions
export const adminRoles = pgTable("admin_roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  description: text("description"),
  permissions: text("permissions").notNull(), // JSON array of permissions
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: uuid("created_by").references(() => users.id),
});

// User role assignments
export const userRoleAssignments = pgTable("user_role_assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  roleId: uuid("role_id")
    .references(() => adminRoles.id)
    .notNull(),
  assignedBy: uuid("assigned_by").references(() => users.id),
  assignedAt: timestamp("assigned_at").defaultNow(),
});

// Categories table
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Products table
export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  shortDescription: text("short_description"),
  sellers:json("sellers").$type<{ name: string; price: number }[]>(),
  size: json("size"),
  sku: text("sku").unique().notNull(),
  stock: integer("stock").default(0),
  categoryId: uuid("category_id").references(() => categories.id),
  images: text("images"), // JSON array of image URLs
  modelUrl: text("model_url"),
  featured: boolean("featured").default(false),
  bestSeller: boolean("best_seller").default(false),
  published: boolean("published").default(true),
  features: text("features"),
  tags: text("tags"),
  seoTitle: text("seo_title"),
  variant: text("variant"),
  seoDescription: text("seo_description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Wishlist table
export const wishlist = pgTable("wishlist", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  productId: uuid("product_id").references(() => products.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reviews table
export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  productId: uuid("product_id").references(() => products.id),
  rating: integer("rating").notNull(),
  title: text("title"),
  comment: text("comment"),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

//banners
export const banners = pgTable("banners", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  linkUrl: varchar("link_url", { length: 500 }),
  isActive: boolean("is_active").default(true).notNull(),
  priority: integer("priority").default(0).notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  bannerType: varchar("banner_type", { length: 50 })
    .default("general")
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Visits table for tracking
export const visits = pgTable("visits", {
  id: uuid("id").primaryKey().defaultRandom(),
  visitorId: text("visitor_id").notNull(),
  path: text("path").notNull(),
  referrer: text("referrer"),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => ({
    compoundKey: primaryKey({
      columns: [table.provider, table.providerAccountId],
    }),
  })
);

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires").notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires").notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const oauthTokens = pgTable("oauth_tokens", {
  provider: text("provider").primaryKey(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  userId: text("user_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});


// Blogs table
export const blogs = pgTable("blogs", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").unique().notNull(),
  excerpt: text("excerpt"), // Short description for previews
  content: text("content").notNull(), // Full blog content (supports HTML/Markdown)
  featuredImage: text("featured_image"), // URL to the main blog image
  tags: text("tags"), // JSON string of tags array
  metaTitle: text("meta_title"), // SEO meta title
  metaDescription: text("meta_description"), // SEO meta description
  status: text("status").default("draft").notNull(), // draft, published, archived
  publishedAt: timestamp("published_at"),
  authorId: uuid("author_id").references(() => users.id).notNull(),
  readTime: text("read_time"), // Estimated read time (e.g., "5 min read")
  viewCount: text("view_count").default("0"), // Track blog views
  featured: boolean("featured").default(false), // Mark as featured blog
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Blog categories table (optional - for better organization)
export const blogCategories = pgTable("blog_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  description: text("description"),
  color: text("color").default("#3B82F6"), // Hex color for category
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Blog-Category relationship table (many-to-many)
export const blogCategoryRelations = pgTable("blog_category_relations", {
  id: uuid("id").primaryKey().defaultRandom(),
  blogId: uuid("blog_id").references(() => blogs.id, { onDelete: "cascade" }).notNull(),
  categoryId: uuid("category_id").references(() => blogCategories.id, { onDelete: "cascade" }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations for Drizzle queries
import { relations } from "drizzle-orm";

export const blogsRelations = relations(blogs, ({ one, many }) => ({
  author: one(users, {
    fields: [blogs.authorId],
    references: [users.id],
  }),
  categories: many(blogCategoryRelations),
}));

export const usersRelations = relations(users, ({ many }) => ({
  blogs: many(blogs),
}));

export const blogCategoriesRelations = relations(blogCategories, ({ many }) => ({
  blogs: many(blogCategoryRelations),
}));

export const blogCategoryRelationsRelations = relations(blogCategoryRelations, ({ one }) => ({
  blog: one(blogs, {
    fields: [blogCategoryRelations.blogId],
    references: [blogs.id],
  }),
  category: one(blogCategories, {
    fields: [blogCategoryRelations.categoryId],
    references: [blogCategories.id],
  }),
}));
