import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  const DATABASE_URL = process.env.POSTGRES_URL;

  if (!DATABASE_URL) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const sql = neon(DATABASE_URL);

  try {
    switch (req.method) {
      case 'GET':
        // Get referral stats for a user
        const { user_id } = req.query;

        if (!user_id) {
          return res.status(400).json({ error: 'user_id is required' });
        }

        // Get user's referral stats from profile
        const profile = await sql`
          SELECT
            total_referrals,
            total_referral_earnings,
            username
          FROM profiles
          WHERE id = ${user_id as string}
        `;

        if (profile.length === 0) {
          return res.status(404).json({ error: 'User not found' });
        }

        // Get referral history
        const referralHistory = await sql`
          SELECT
            r.id,
            r.reward_amount,
            r.tier_name,
            r.created_at,
            p.username as referred_username,
            p.avatar_url as referred_avatar
          FROM referrals r
          JOIN profiles p ON r.referred_id = p.id
          WHERE r.referrer_id = ${user_id as string}
          ORDER BY r.created_at DESC
          LIMIT 50
        `;

        // Calculate this month's earnings
        const thisMonth = await sql`
          SELECT COALESCE(SUM(reward_amount), 0) as month_earnings
          FROM referrals
          WHERE referrer_id = ${user_id as string}
          AND created_at >= date_trunc('month', CURRENT_TIMESTAMP)
        `;

        return res.status(200).json({
          success: true,
          stats: {
            totalReferrals: profile[0].total_referrals || 0,
            totalEarned: profile[0].total_referral_earnings || 0,
            thisMonthEarned: parseInt(thisMonth[0].month_earnings) || 0,
            username: profile[0].username
          },
          referralHistory: referralHistory
        });

      case 'POST':
        // Create a new referral (called when someone signs up with a referral code)
        const { referrer_username, referred_user_id } = req.body;

        if (!referrer_username || !referred_user_id) {
          return res.status(400).json({ error: 'referrer_username and referred_user_id are required' });
        }

        // Get referrer's ID and current referral count
        const referrer = await sql`
          SELECT id, total_referrals
          FROM profiles
          WHERE username = ${referrer_username} OR username = ${'@' + referrer_username}
        `;

        if (referrer.length === 0) {
          return res.status(404).json({ error: 'Referrer not found' });
        }

        const referrerId = referrer[0].id;
        const currentReferrals = referrer[0].total_referrals || 0;

        // Determine tier and reward amount based on current referrals
        let tierName = 'Bronze';
        let rewardAmount = 5;

        if (currentReferrals >= 20) {
          tierName = 'Gold';
          rewardAmount = 10;
        } else if (currentReferrals >= 5) {
          tierName = 'Silver';
          rewardAmount = 7;
        }

        // Check if this user was already referred
        const existingReferral = await sql`
          SELECT id FROM referrals WHERE referred_id = ${referred_user_id}
        `;

        if (existingReferral.length > 0) {
          return res.status(400).json({ error: 'User was already referred' });
        }

        // Don't allow self-referrals
        if (referrerId === referred_user_id) {
          return res.status(400).json({ error: 'Cannot refer yourself' });
        }

        // Create the referral record
        await sql`
          INSERT INTO referrals (referrer_id, referred_id, reward_amount, tier_name)
          VALUES (${referrerId}, ${referred_user_id}, ${rewardAmount}, ${tierName})
        `;

        // Update referrer's stats in profiles table
        await sql`
          UPDATE profiles
          SET
            total_referrals = total_referrals + 1,
            total_referral_earnings = total_referral_earnings + ${rewardAmount}
          WHERE id = ${referrerId}
        `;

        return res.status(201).json({
          success: true,
          message: 'Referral created successfully',
          reward: {
            amount: rewardAmount,
            tier: tierName
          }
        });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Referrals API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
