const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get('/summary', async (req, res) => {
    try {
      const [rows] = await db.execute(`
        SELECT
          u.username AS walker_username,
          COUNT(r.rating_id) AS total_ratings,
          ROUND(AVG(r.rating), 1) AS average_rating,
          COUNT(CASE WHEN wr.status = 'completed' THEN 1 END) AS completed_walks
        FROM Users u
        LEFT JOIN WalkRatings r ON u.user_id = r.walker_id
        LEFT JOIN WalkApplications a ON u.user_id = a.walker_id
        LEFT JOIN WalkRequests wr ON a.request_id = wr.request_id AND a.status = 'accepted'
        WHERE u.role = 'walker'
        GROUP BY u.user_id
      `);
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch walker summary' });
    }
  });

  return router;
};
