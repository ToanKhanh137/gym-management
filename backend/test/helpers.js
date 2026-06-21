import jwt from 'jsonwebtoken';

export const authHeader = (role = 'owner', id = 1) => ({
  Authorization: `Bearer ${jwt.sign(
    { id, email: `${role}@gym.com`, role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )}`,
});
