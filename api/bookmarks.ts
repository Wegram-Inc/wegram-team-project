import { neonSimple } from '../src/lib/neonSimple';

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { method } = req;

    switch (method) {
      case 'GET':
        // Get user bookmarks
        const { userId } = req.query;

        if (!userId) {
          return res.status(400).json({
            success: false,
            error: 'User ID is required'
          });
        }

        const bookmarks = await neonSimple.getUserBookmarks(userId);
        return res.status(200).json({
          success: true,
          bookmarks
        });

      case 'POST':
        // Add bookmark
        const { userId: bookmarkUserId, postId } = req.body;

        if (!bookmarkUserId || !postId) {
          return res.status(400).json({
            success: false,
            error: 'User ID and Post ID are required'
          });
        }

        const bookmarkSuccess = await neonSimple.bookmarkPost(bookmarkUserId, postId);

        if (bookmarkSuccess) {
          return res.status(200).json({
            success: true,
            message: 'Post bookmarked successfully'
          });
        } else {
          return res.status(500).json({
            success: false,
            error: 'Failed to bookmark post'
          });
        }

      case 'DELETE':
        // Remove bookmark
        const { userId: removeUserId, postId: removePostId } = req.body;

        if (!removeUserId || !removePostId) {
          return res.status(400).json({
            success: false,
            error: 'User ID and Post ID are required'
          });
        }

        const removeSuccess = await neonSimple.removeBookmark(removeUserId, removePostId);

        if (removeSuccess) {
          return res.status(200).json({
            success: true,
            message: 'Bookmark removed successfully'
          });
        } else {
          return res.status(500).json({
            success: false,
            error: 'Failed to remove bookmark'
          });
        }

      default:
        return res.status(405).json({
          success: false,
          error: 'Method not allowed'
        });
    }
  } catch (error) {
    console.error('Bookmarks API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}