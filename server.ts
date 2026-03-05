import express from 'express';
import { createServer as createViteServer } from 'vite';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db, { initDb } from './database';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cors());

  // Initialize DB
  initDb();

  // API Routes

  // Admin Login
  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    try {
      const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get(username) as any;
      
      if (!admin || !bcrypt.compareSync(password, admin.password_hash)) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  });

  // Middleware to verify token
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // Get Appointments (Public for slot checking, but maybe we want a specific public endpoint for slots)
  // Let's make a specific endpoint for available slots to protect patient data
  
  // Get Available Slots for a Date
  app.get('/api/slots', (req, res) => {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: 'Date is required' });

    try {
      const appointments = db.prepare("SELECT time_slot FROM appointments WHERE date = ? AND status != 'cancelled'").all(date) as any[];
      const bookedSlots = appointments.map(a => a.time_slot);
      
      // Check if it's Sunday
      const dayOfWeek = new Date(date as string).getDay();
      if (dayOfWeek === 0) {
        return res.json({ availableSlots: [] });
      }

      // Define all possible slots (10 AM to 9 PM)
      const allSlots = [
        '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', 
        '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
        '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', 
        '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
        '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM',
        '08:00 PM', '08:30 PM'
      ];

      const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
      res.json({ availableSlots });
    } catch (error) {
      console.error('Error fetching slots:', error);
      res.status(500).json({ error: 'Failed to fetch slots', details: (error as any).message });
    }
  });

  // Book Appointment (Public)
  app.post('/api/appointments', (req, res) => {
    const { patientName, phoneNumber, date, timeSlot } = req.body;
    
    // Basic validation
    if (!patientName || !phoneNumber || !date || !timeSlot) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      // Check if slot is already taken
      const existing = db.prepare("SELECT id FROM appointments WHERE date = ? AND time_slot = ? AND status != 'cancelled'").get(date, timeSlot);
      if (existing) {
        return res.status(409).json({ error: 'Slot already booked' });
      }

      const info = db.prepare('INSERT INTO appointments (patient_name, phone_number, date, time_slot) VALUES (?, ?, ?, ?)').run(patientName, phoneNumber, date, timeSlot);
      res.json({ id: info.lastInsertRowid, message: 'Appointment booked successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to book appointment' });
    }
  });

  // Admin: Get All Appointments
  app.get('/api/admin/appointments', authenticateToken, (req, res) => {
    const { date } = req.query;
    try {
      let query = 'SELECT * FROM appointments';
      const params = [];
      
      if (date) {
        query += ' WHERE date = ?';
        params.push(date);
      }
      
      query += ' ORDER BY date ASC, time_slot ASC';
      
      const appointments = db.prepare(query).all(...params);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch appointments' });
    }
  });

  // Admin: Book Appointment (can override checks if needed, but we'll stick to standard for now)
  app.post('/api/admin/appointments', authenticateToken, (req, res) => {
    const { patientName, phoneNumber, date, timeSlot } = req.body;
    
    try {
      // Check if slot is already taken
      const existing = db.prepare("SELECT id FROM appointments WHERE date = ? AND time_slot = ? AND status != 'cancelled'").get(date, timeSlot);
      if (existing) {
        return res.status(409).json({ error: 'Slot already booked' });
      }

      const info = db.prepare('INSERT INTO appointments (patient_name, phone_number, date, time_slot, created_by) VALUES (?, ?, ?, ?, ?)')
        .run(patientName, phoneNumber, date, timeSlot, 'admin');
      res.json({ id: info.lastInsertRowid, message: 'Appointment booked successfully' });
    } catch (error) {
      console.error('Admin booking error:', error);
      res.status(500).json({ error: 'Failed to book appointment', details: (error as any).message });
    }
  });

  // Admin: Cancel Appointment
  app.delete('/api/admin/appointments/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    try {
      db.prepare("UPDATE appointments SET status = 'cancelled' WHERE id = ?").run(id);
      res.json({ message: 'Appointment cancelled' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to cancel appointment' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static file serving (if needed later)
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
