import { daysFromEntries } from '@/lib/utils';
import { query } from './_generated/server';
import { v } from 'convex/values';

export const getAllUserEntries = query({
  args: {},
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error('Not authenticated');
    }

    const entries = await ctx.db
      .query('protein_entries')
      .withIndex('by_user_date', q => q.eq('user_id', identity.tokenIdentifier))
      .order('desc')
      .collect();

    const goals = await ctx.db
      .query('daily_goals')
      .withIndex('by_user_date', q => q.eq('user_id', identity.tokenIdentifier))
      .order('desc')
      .collect();

    const days = daysFromEntries(entries, goals);

    return days;
  },
});

export const getDayByDate = query({
  args: { date: v.string() },
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error('Not authenticated');
    }

    const entries = await ctx.db
      .query('protein_entries')
      .withIndex('by_user_date', q => q.eq('user_id', identity.tokenIdentifier))
      .order('desc')
      .collect();

    const goals = await ctx.db
      .query('daily_goals')
      .withIndex('by_user_date', q => q.eq('user_id', identity.tokenIdentifier))
      .order('desc')
      .collect();

    return daysFromEntries(entries, goals)[0];
  },
});
