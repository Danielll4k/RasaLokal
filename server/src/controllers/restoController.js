import { pool, memoryStore } from '../config/db.js';

export async function getRestaurants(req, res, next) {
  try {
    const { query: searchQuery, category } = req.query;

    if (pool.totalCount > 0) {
      try {
        let sql = 'SELECT * FROM restaurants WHERE 1=1';
        const params = [];
        if (searchQuery) {
          params.push(`%${searchQuery}%`);
          sql += ` AND (name ILIKE $${params.length} OR address ILIKE $${params.length} OR category ILIKE $${params.length})`;
        }
        if (category && category !== 'All') {
          params.push(category);
          sql += ` AND category ILIKE $${params.length}`;
        }
        sql += ' ORDER BY average_rating DESC';
        const result = await pool.query(sql, params);
        return res.json({ success: true, data: result.rows });
      } catch (dbErr) {
        // Fallback to memoryStore
      }
    }

    let results = [...memoryStore.restaurants];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      results = results.filter(r => 
        r.name.toLowerCase().includes(q) || 
        r.category.toLowerCase().includes(q) ||
        r.address.toLowerCase().includes(q)
      );
    }
    if (category && category !== 'All') {
      results = results.filter(r => r.category.toLowerCase().includes(category.toLowerCase()));
    }

    res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
}

export async function getRestaurantById(req, res, next) {
  try {
    const { id } = req.params;

    if (pool.totalCount > 0) {
      try {
        const result = await pool.query('SELECT * FROM restaurants WHERE id = $1', [id]);
        if (result.rows.length > 0) {
          return res.json({ success: true, data: result.rows[0] });
        }
      } catch (dbErr) {
        // Fallback
      }
    }

    const found = memoryStore.restaurants.find(r => r.id === id || r.name.toLowerCase().includes(id.toLowerCase()));
    if (!found) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }
    res.json({ success: true, data: found });
  } catch (err) {
    next(err);
  }
}
