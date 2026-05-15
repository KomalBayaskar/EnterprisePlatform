import { db } from '../data/mockDb.js';

export const getUsers = (req, res) => {
  res.json(db.users);
};

export const createUser = (req, res) => {
  const newUser = {
    id: db.users.length + 1,
    ...req.body,
    lastActive: new Date().toISOString(),
    status: 'Active'
  };
  db.users.push(newUser);
  res.status(201).json(newUser);
};

export const updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  const index = db.users.findIndex(u => u.id === id);
  if (index !== -1) {
    db.users[index] = { ...db.users[index], ...req.body };
    res.json(db.users[index]);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

export const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);
  db.users = db.users.filter(u => u.id !== id);
  res.json({ message: 'User deleted' });
};
