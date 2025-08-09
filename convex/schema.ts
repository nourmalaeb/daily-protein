import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  daily_goals: defineTable({
    date: v.string(),
    goal_id: v.float64(),
    protein_goal_grams: v.float64(),
    user_id: v.string(),
    created_at: v.optional(v.string()),
  })
    .index('by_date', ['date'])
    .index('by_date_user', ['date', 'user_id'])
    .index('by_user', ['user_id'])
    .index('by_user_date', ['user_id', 'date']),
  daily_totals: defineTable({
    date: v.string(),
    goal_met: v.string(),
    last_updated: v.string(),
    total_id: v.float64(),
    total_protein_grams: v.float64(),
    user_id: v.string(),
  })
    .index('by_date', ['date'])
    .index('by_date_user', ['date', 'user_id'])
    .index('by_user', ['user_id'])
    .index('by_user_date', ['user_id', 'date']),
  meal_totals: defineTable({
    date: v.string(),
    item_count: v.float64(),
    last_updated: v.string(),
    meal: v.union(
      v.literal('breakfast'),
      v.literal('lunch'),
      v.literal('dinner'),
      v.literal('snacks')
    ),
    meal_total_id: v.float64(),
    total_protein_grams: v.float64(),
    user_id: v.string(),
  })
    .index('by_date', ['date'])
    .index('by_date_user', ['date', 'user_id'])
    .index('by_user', ['user_id'])
    .index('by_user_date', ['user_id', 'date']),
  protein_entries: defineTable({
    date: v.string(),
    entry_id: v.optional(v.float64()),
    food_name: v.string(),
    meal: v.union(
      v.literal('breakfast'),
      v.literal('lunch'),
      v.literal('dinner'),
      v.literal('snacks')
    ),
    protein_grams: v.float64(),
    user_id: v.string(),
    created_at: v.optional(v.string()),
  })
    .index('by_date', ['date'])
    .index('by_date_user', ['date', 'user_id'])
    .index('by_user', ['user_id'])
    .index('by_user_date', ['user_id', 'date']),
  user_preferences: defineTable({
    id: v.float64(),
    preference_key: v.string(),
    preference_value: v.float64(),
    updated_at: v.string(),
    user_id: v.string(),
    created_at: v.optional(v.string()),
  }).index('by_user', ['user_id']),
});
