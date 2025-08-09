import { query } from './_generated/server';

export const get = query({
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error('Not authenticated');
    }
    return await ctx.db
      .query('user_preferences')
      .withIndex('by_user', q => q.eq('user_id', identity.tokenIdentifier))
      .collect();
  },
});

export const getAll = query({
  handler: async ctx => {
    return await ctx.db.query('user_preferences').collect();
  },
});
