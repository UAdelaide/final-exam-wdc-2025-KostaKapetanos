const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'DogWalkService',
});

async function seedDatabase() {
  try {
    const [users] = await db.execute('SELECT COUNT(*) AS count FROM Users');
    if (users[0].count === 0) {
      await db.execute(`
        INSERT INTO Users (username, email, password_hash, role)
        VALUES
        ('alice123', 'alice@example.com', 'hashed123', 'owner'),
        ('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
        ('carol123', 'carol@example.com', 'hashed789', 'owner'),
        ('mike22', 'mike@example.com', 'hashed321', 'walker'),
        ('sarahdog', 'sarah@example.com', 'hashed654', 'owner')
      `);

      await db.execute(`
        INSERT INTO Dogs (owner_id, name, size)
        VALUES
        ((SELECT user_id FROM Users WHERE username = 'alice123'), 'Max', 'medium'),
        ((SELECT user_id FROM Users WHERE username = 'carol123'), 'Bella', 'small'),
        ((SELECT user_id FROM Users WHERE username = 'alice123'), 'Charlie', 'large'),
        ((SELECT user_id FROM Users WHERE username = 'sarahdog'), 'Luna', 'small'),
        ((SELECT user_id FROM Users WHERE username = 'carol123'), 'Jax', 'medium')
      `);

      await db.execute(`
        INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status)
        VALUES
        ((SELECT dog_id FROM Dogs WHERE name = 'Max'), '2025-06-10 08:00:00', 30, 'Norwood', 'open'),
        ((SELECT dog_id FROM Dogs WHERE name = 'Bella'), '2025-06-10 09:30:00', 45, 'Glenelg', 'accepted'),
        ((SELECT dog_id FROM Dogs WHERE name = 'Charlie'), '2025-06-11 10:00:00', 20, 'Unley', 'open'),
        ((SELECT dog_id FROM Dogs WHERE name = 'Luna'), '2025-06-11 14:00:00', 60, 'Burnside', 'open'),
        ((SELECT dog_id FROM Dogs WHERE name = 'Jax'), '2025-06-12 07:30:00', 35, 'Henley Beach', 'open')
      `);

      await db.execute(`
        INSERT INTO WalkApplications (request_id, walker_id, status)
        VALUES (
          (SELECT request_id FROM WalkRequests WHERE location = 'Glenelg'),
          (SELECT user_id FROM Users WHERE username = 'bobwalker'),
          'accepted'
        )
      `);

      await db.execute(`
        INSERT INTO WalkRatings (request_id, walker_id, owner_id, rating, comments)
        VALUES (
          (SELECT request_id FROM WalkRequests WHERE location = 'Glenelg'),
          (SELECT user_id FROM Users WHERE username = 'bobwalker'),
          (SELECT user_id FROM Users WHERE username = 'carol123'),
          5,
          'Very reliable walker!'
        )
      `);

      console.log('Sample data inserted into database.');
    }
  } catch (err) {
    console.error('Error seeding database:', err.message);
  }
}

seedDatabase();

module.exports = db;
