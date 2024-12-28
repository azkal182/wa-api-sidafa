import type { RequestHandler } from 'express';
import { sessionExists } from '../wa';

const validate: RequestHandler = (req, res, next) => {
  if (!sessionExists(req.params.sessionId)) {
    res.status(404).json({ error: 'Session not found' });
    return; // Pastikan fungsi berhenti setelah mengembalikan respons
  }
  next();
};

export default validate;
