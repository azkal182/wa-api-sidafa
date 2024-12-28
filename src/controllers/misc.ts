// @ts-nocheck

import type { RequestHandler } from 'express';
import { logger } from "../utils/logger";
import { getSession, jidExists } from '../wa';

export const makePhotoURLHandler =
  (type: 'number' | 'group' = 'number'): RequestHandler =>
  async (req, res) => {
    try {
      const { sessionId, jid } = req.params;
      const session = getSession(sessionId);

      if (!session) {
        res.status(404).json({ error: 'Session not found' });
        return; // Pastikan fungsi berhenti setelah respons
      }

      const exists = await jidExists(session, jid, type);
      if (!exists) {
        res.status(400).json({ error: 'Jid does not exist' });
        return; // Pastikan fungsi berhenti setelah respons
      }

      const url = await session.profilePictureUrl(jid, 'image');
      res.status(200).json({ url });
      return; // Tambahkan return eksplisit
    } catch (e) {
      const message = 'An error occurred during photo fetch';
      logger.error(e, message);
      res.status(500).json({ error: message });
      return; // Tambahkan return eksplisit untuk error handler
    }
  };
