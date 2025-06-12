import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    'INSERT INTO users1 (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, hashedPassword, role || 'user'],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: 'Email already registered' });
        }
        return res.status(500).json({ error: err });
      }
      res.status(201).json({ message: 'User registered successfully' });
    }
  );
};

///////////////////////////////////////////////////

export const login = (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users1 WHERE email = ?', [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '3h' }
    );
    res.json({ token });
  });
};



export const userInfo=async (req, res) => {
  try {
    const userId = req.user.id;

    db.query(
      'SELECT id, name, email, role FROM users1 WHERE id = ?',
      [userId],
      (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        if (results.length === 0)
          return res.status(404).json({ error: 'User not found' });

        res.status(200).json(results[0]);
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}
