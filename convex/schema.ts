import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // User preferences and saved locations
  userPreferences: defineTable({
    userId: v.id("users"),
    locations: v.array(v.object({
      name: v.string(),
      lat: v.number(),
      lon: v.number(),
    })),
    primaryLocation: v.optional(v.string()),
  }).index("by_user", ["userId"]),

  // Chat messages with the AI bot
  chatMessages: defineTable({
    userId: v.id("users"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  // Cached weather data
  weatherCache: defineTable({
    location: v.string(),
    data: v.string(), // JSON stringified weather data
    fetchedAt: v.number(),
  }).index("by_location", ["location"]),

  // Cached news data
  newsCache: defineTable({
    category: v.string(),
    data: v.string(), // JSON stringified news data
    fetchedAt: v.number(),
  }).index("by_category", ["category"]),
});
