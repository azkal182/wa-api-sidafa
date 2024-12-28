// @ts-nocheck
import type { RequestHandler } from 'express';
import {prisma} from "../utils/prisma"
import { logger } from "../utils/logger";
import { getSession, jidExists } from '../wa';
import { makePhotoURLHandler } from './misc';


export const list: RequestHandler = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { cursor = undefined, limit = 25 } = req.query;
    const contacts = await prisma.contact.findMany({
      cursor: cursor ? { pkId: Number(cursor) } : undefined,
      take: Number(limit),
      skip: cursor ? 1 : 0,
      where: { id: { endsWith: 's.whatsapp.net' }, sessionId },
    });

    res.status(200).json({
      data: contacts,
      cursor:
        contacts.length !== 0 && contacts.length === Number(limit)
          ? contacts[contacts.length - 1].pkId
          : null,
    });
  } catch (e) {
    const message = 'An error occured during contact list';
    logger.error(e, message);
    res.status(500).json({ error: message });
  }
};

export const listBlocked: RequestHandler = async (req, res) => {
  try {
    const session = getSession(req.params.sessionId)!;
    const data = await session.fetchBlocklist();
    res.status(200).json(data);
  } catch (e) {
    const message = 'An error occured during blocklist fetch';
    logger.error(e, message);
    res.status(500).json({ error: message });
  }
};

export const updateBlock: RequestHandler = async (req, res) => {
    try {
      const session = getSession(req.params.sessionId);
  
      if (!session) {
        res.status(404).json({ error: 'Session not found' });
        return; // Pastikan fungsi berhenti di sini
      }
  
      const { jid, action = 'block' } = req.body;
  
      const exists = await jidExists(session, jid);
      if (!exists) {
        res.status(400).json({ error: 'Jid does not exist' });
        return; // Pastikan fungsi berhenti di sini
      }
  
      await session.updateBlockStatus(jid, action);
      res.status(200).json({ message: `Contact ${action}ed` });
      return; // Pastikan fungsi eksplisit mengembalikan void
    } catch (e) {
      const message = 'An error occurred during blocklist update';
      logger.error(e, message);
      res.status(500).json({ error: message });
      return; // Tambahkan return eksplisit untuk error handler
    }
  };
  

export const check: RequestHandler = async (req, res) => {
  try {
    const { sessionId, jid } = req.params;
    const session = getSession(sessionId)!;

    const exists = await jidExists(session, jid);
    res.status(200).json({ exists });
  } catch (e) {
    const message = 'An error occured during jid check';
    logger.error(e, message);
    res.status(500).json({ error: message });
  }
};

export const photo = makePhotoURLHandler();