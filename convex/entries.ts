import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const getAllEntries = query({
  args: {},
  handler: async ctx => {
    return await ctx.db.query('protein_entries').collect();
  },
});

export const getAllUserEntries = query({
  args: {},
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error('Not authenticated');
    }
    return await ctx.db
      .query('protein_entries')
      .withIndex('by_user_date', q => q.eq('user_id', identity.tokenIdentifier))
      .order('desc')
      .collect();
  },
});

export const getUserEntriesForDate = query({
  args: { user_id: v.string(), date: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error('Not authenticated');
    }
    return await ctx.db
      .query('protein_entries')
      .withIndex('by_user_date', q =>
        q.eq('user_id', identity.tokenIdentifier).eq('date', args.date)
      )
      .order('desc')
      .collect();
  },
});

export const add = mutation({
  args: {
    date: v.string(),
    meal: v.union(
      v.literal('breakfast'),
      v.literal('lunch'),
      v.literal('dinner'),
      v.literal('snacks')
    ),
    food_name: v.string(),
    protein_grams: v.float64(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error('Not authenticated');
    }
    const taskId = await ctx.db.insert('protein_entries', {
      ...args,
      user_id: identity.tokenIdentifier,
    });
    console.log(taskId + ' created');
  },
});

export const update = mutation({
  args: {
    entry_id: v.id('protein_entries'),
    food_name: v.string(),
    protein_grams: v.number(),
    meal: v.union(
      v.literal('breakfast'),
      v.literal('lunch'),
      v.literal('dinner'),
      v.literal('snacks')
    ),
  },
  handler: async (ctx, args) => {
    const { entry_id, food_name, protein_grams, meal } = args;
    return await ctx.db.patch(entry_id, { food_name, protein_grams, meal });
  },
});

export const deleteEntry = mutation({
  args: { id: v.id('protein_entries') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
