import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import db from './database.js';
import { authMiddleware, generateToken } from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// Configurar multer para upload de fotos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userDir = join(__dirname, 'uploads', req.userId.toString());
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// ==================== AUTENTICAÇÃO ====================

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const stmt = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
    const result = stmt.run(username, email, hashedPassword);

    const token = generateToken(result.lastInsertRowid);

    res.json({
      token,
      user: { id: result.lastInsertRowid, username, email }
    });
  } catch (error) {
    if (error.message.includes('UNIQUE')) {
      return res.status(400).json({ error: 'Usuário ou email já existe' });
    }
    res.status(500).json({ error: 'Erro ao criar conta' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    const token = generateToken(user.id);

    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const user = db.prepare('SELECT id, username, email FROM users WHERE id = ?').get(req.userId);
  res.json({ user });
});

// ==================== PERFIL ====================

app.get('/api/profile', authMiddleware, (req, res) => {
  const profile = db.prepare('SELECT * FROM user_profiles WHERE user_id = ?').get(req.userId);
  res.json({ profile: profile || {} });
});

app.put('/api/profile', authMiddleware, (req, res) => {
  const { name, age, weight, height, gender, goal, activity_level, injuries, equipment, dietary_restrictions } = req.body;

  const existing = db.prepare('SELECT id FROM user_profiles WHERE user_id = ?').get(req.userId);

  if (existing) {
    db.prepare(`
      UPDATE user_profiles SET name=?, age=?, weight=?, height=?, gender=?, goal=?, 
      activity_level=?, injuries=?, equipment=?, dietary_restrictions=? WHERE user_id=?
    `).run(name, age, weight, height, gender, goal, activity_level, injuries, equipment, dietary_restrictions, req.userId);
  } else {
    db.prepare(`
      INSERT INTO user_profiles (user_id, name, age, weight, height, gender, goal, 
      activity_level, injuries, equipment, dietary_restrictions) VALUES (?,?,?,?,?,?,?,?,?,?)
    `).run(req.userId, name, age, weight, height, gender, goal, activity_level, injuries, equipment, dietary_restrictions);
  }

  res.json({ success: true });
});

// ==================== TREINOS ====================

app.get('/api/workouts', authMiddleware, (req, res) => {
  const workouts = db.prepare('SELECT * FROM workouts WHERE user_id = ? ORDER BY created_at DESC').all(req.userId);
  res.json({ workouts: workouts.map(w => ({ ...w, schedule: JSON.parse(w.schedule) })) });
});

app.post('/api/workouts', authMiddleware, (req, res) => {
  const { title, goal, level, split, equipment, muscle_focus, schedule } = req.body;

  const stmt = db.prepare(`
    INSERT INTO workouts (user_id, title, goal, level, split, equipment, muscle_focus, schedule)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(req.userId, title, goal, level, split, equipment, muscle_focus, JSON.stringify(schedule));

  res.json({ id: result.lastInsertRowid, success: true });
});

app.put('/api/workouts/:id', authMiddleware, (req, res) => {
  const { title, goal, level, split, equipment, muscle_focus, schedule } = req.body;

  db.prepare(`
    UPDATE workouts SET title=?, goal=?, level=?, split=?, equipment=?, muscle_focus=?, schedule=?
    WHERE id=? AND user_id=?
  `).run(title, goal, level, split, equipment, muscle_focus, JSON.stringify(schedule), req.params.id, req.userId);

  res.json({ success: true });
});

app.delete('/api/workouts/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM workouts WHERE id=? AND user_id=?').run(req.params.id, req.userId);
  res.json({ success: true });
});

// ==================== ANÁLISE CORPORAL ====================

app.post('/api/body-analysis', authMiddleware, upload.fields([
  { name: 'front', maxCount: 1 },
  { name: 'back', maxCount: 1 },
  { name: 'side', maxCount: 1 }
]), (req, res) => {
  try {
    const frontPhoto = req.files['front']?.[0]?.filename;
    const backPhoto = req.files['back']?.[0]?.filename;
    const sidePhoto = req.files['side']?.[0]?.filename;

    const stmt = db.prepare(`
      INSERT INTO body_analyses (user_id, front_photo, back_photo, side_photo, analysis_result, suggested_workout)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(req.userId, frontPhoto, backPhoto, sidePhoto, '{}', '{}');

    res.json({
      id: result.lastInsertRowid,
      photos: { front: frontPhoto, back: backPhoto, side: sidePhoto }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer upload' });
  }
});

app.put('/api/body-analysis/:id', authMiddleware, (req, res) => {
  const { analysis_result, suggested_workout } = req.body;

  db.prepare(`
    UPDATE body_analyses SET analysis_result=?, suggested_workout=? WHERE id=? AND user_id=?
  `).run(JSON.stringify(analysis_result), JSON.stringify(suggested_workout), req.params.id, req.userId);

  res.json({ success: true });
});

app.get('/api/body-analysis', authMiddleware, (req, res) => {
  const analyses = db.prepare('SELECT * FROM body_analyses WHERE user_id = ? ORDER BY created_at DESC').all(req.userId);
  res.json({
    analyses: analyses.map(a => ({
      ...a,
      analysis_result: JSON.parse(a.analysis_result || '{}'),
      suggested_workout: JSON.parse(a.suggested_workout || '{}')
    }))
  });
});

// ==================== PROGRESSO ====================

app.post('/api/progress', authMiddleware, (req, res) => {
  const { weight, body_fat, notes } = req.body;

  const stmt = db.prepare('INSERT INTO progress_logs (user_id, weight, body_fat, notes) VALUES (?, ?, ?, ?)');
  const result = stmt.run(req.userId, weight, body_fat, notes);

  res.json({ id: result.lastInsertRowid, success: true });
});

app.get('/api/progress', authMiddleware, (req, res) => {
  const logs = db.prepare('SELECT * FROM progress_logs WHERE user_id = ? ORDER BY created_at DESC').all(req.userId);
  res.json({ logs });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
});
