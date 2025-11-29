const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

const userSelect = {
  id: true,
  name: true,
  email: true,
  age: true,
  weightKg: true,
  heightCm: true,
  healthGoal: true,
  activityLevel: true,
  createdAt: true,
  updatedAt: true,
};

// Authentication middleware
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No authorization header provided' });
  }
  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Invalid authorization header format' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// User registration
app.post('/users/register', async (req, res) => {
  try {
    const { name, email, password, age, weightKg, heightCm, healthGoal, activityLevel } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        age,
        weightKg,
        heightCm,
        healthGoal,
        activityLevel,
      },
    });
    res.status(201).json({ id: user.id, email: user.email });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});

// Public profile creation (no auth, used by frontend onboarding)
app.post('/profiles', async (req, res) => {
  try {
    const { name, email, age, weightKg, heightCm, healthGoal, activityLevel } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'A profile with this email already exists.' });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: null,
        age: age ? Number(age) : null,
        weightKg: weightKg ? Number(weightKg) : null,
        heightCm: heightCm ? Number(heightCm) : null,
        healthGoal,
        activityLevel,
      },
      select: userSelect,
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create profile', error: err.message });
  }
});

// Public profile retrieval
app.get('/profiles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id }, select: userSelect });
    if (!user) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
});

// Public profile update
app.put('/profiles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, weightKg, heightCm, healthGoal, activityLevel } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        age: typeof age !== 'undefined' ? Number(age) : undefined,
        weightKg: typeof weightKg !== 'undefined' ? Number(weightKg) : undefined,
        heightCm: typeof heightCm !== 'undefined' ? Number(heightCm) : undefined,
        healthGoal,
        activityLevel,
      },
      select: userSelect,
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
});

// User login
app.post('/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user has a password (null for profiles created via /profiles endpoint)
    if (!user.passwordHash) {
      return res.status(401).json({ message: 'Account requires password setup. Please use the onboarding flow.' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

// Get all users (protected route)
app.get('/users', authMiddleware, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
        weightKg: true,
        heightCm: true,
        healthGoal: true,
        activityLevel: true,
        createdAt: true,
      },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
});

// Get user by ID (protected)
app.get('/users/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
        weightKg: true,
        heightCm: true,
        healthGoal: true,
        activityLevel: true,
        createdAt: true,
      },
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
});

// Update user (protected)
app.put('/users/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, weightKg, heightCm, healthGoal, activityLevel } = req.body;
    const user = await prisma.user.update({
      where: { id },
      data: { name, age, weightKg, heightCm, healthGoal, activityLevel },
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user', error: err.message });
  }
});

// Delete user (protected)
app.delete('/users/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
});

// Create activity (protected)
app.post('/activities', authMiddleware, async (req, res) => {
  try {
    const { title, durationMinutes, tags, completedAt, calories, intensity } = req.body;
    const activity = await prisma.activity.create({
      data: {
        title,
        durationMinutes,
        tags,
        completedAt: completedAt ? new Date(completedAt) : null,
        calories,
        intensity,
        userId: req.userId,
      },
    });
    res.status(201).json(activity);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create activity', error: err.message });
  }
});

// Get activities for a user (protected)
app.get('/users/:userId/activities', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const activities = await prisma.activity.findMany({ where: { userId } });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch activities', error: err.message });
  }
});

// Health check endpoint for Docker
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
