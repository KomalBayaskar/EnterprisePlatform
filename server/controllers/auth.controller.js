import jwt from 'jsonwebtoken';
import { db } from '../data/mockDb.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-enterprise-key-2026';

export const login = (req, res) => {
  const { email, password } = req.body;
  
  // In a real app, hash password and check against DB.
  // Using mock check for demo.
  const user = db.users.find(u => u.email === email);
  
  if (!user || password !== 'admin123') {
    return res.status(401).json({ message: 'Invalid credentials. Hint: use password admin123' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};
