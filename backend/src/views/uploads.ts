import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from './auth.js';

const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + '-' + file.originalname.replace(/\s+/g, '_'));
  },
});

const upload = multer({ storage });

export function uploadsRouter(prisma: PrismaClient) {
  const router = express.Router();
  router.use(authMiddleware);

  router.post('/', upload.single('file'), async (req: any, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file' });
    const record = await prisma.attachment.create({
      data: {
        userId: req.userId,
        fileName: req.file.originalname,
        mimeType: req.file.mimetype,
        storageKey: req.file.filename,
      },
    });
    res.json(record);
  });

  router.get('/:id', async (req: any, res) => {
    const file = await prisma.attachment.findFirst({ where: { id: req.params.id, userId: req.userId } });
    if (!file) return res.status(404).json({ error: 'Not found' });
    const full = path.join(uploadDir, file.storageKey);
    if (!fs.existsSync(full)) return res.status(404).json({ error: 'Gone' });
    res.setHeader('Content-Type', file.mimeType);
    fs.createReadStream(full).pipe(res);
  });

  return router;
}

