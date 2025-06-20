const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get('/', async (req, res) => {
    try {
      const [rows] = await db.execute(`
        SELECT d.name AS dog_name, d.size, u.username AS owner_username
        FROM Dogs d
        JOIN Users u ON d.owner_id = u.user_id
      `);
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch dogs' });
    }
  });

  return router;
};
