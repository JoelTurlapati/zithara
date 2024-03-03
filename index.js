const express = require('express');
const { Pool } = require('pg');
const cors=require('cors');
const app = express();
const port = 4500;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'joel',
  password: 'Angel@web22',
  port: 5432,
});
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
app.get('/customers', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM customer_records');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching customers', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
