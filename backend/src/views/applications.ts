import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from './auth.js';

export function applicationsRouter(prisma: PrismaClient) {
	const router = express.Router();
	router.use(authMiddleware);

	router.get('/', async (req: any, res) => {
		const { sort = 'createdAt', order = 'desc', status, q } = req.query as any;
		const where: any = { userId: req.userId };
		if (status) where.status = status;
		if (q) where.OR = [{ title: { contains: q, mode: 'insensitive' } }, { company: { contains: q, mode: 'insensitive' } }];
		const apps = await prisma.application.findMany({
			where,
			orderBy: { [sort]: order === 'asc' ? 'asc' : 'desc' },
			include: { resume: true, coverLetter: true, statusUpdates: true },
		});
		res.json(apps);
	});

	router.post('/', async (req: any, res) => {
		const data = req.body as any;
		const app = await prisma.application.create({
			data: {
				userId: req.userId,
				title: data.title,
				company: data.company,
				description: data.description,
				applicationUrl: data.applicationUrl,
				resumeId: data.resumeId || null,
				coverLetterId: data.coverLetterId || null,
				dateApplied: data.dateApplied ? new Date(data.dateApplied) : null,
				status: (data.status as any) || 'APPLIED',
			},
		});
		res.json(app);
	});

	router.get('/:id', async (req: any, res) => {
		const app = await prisma.application.findFirst({
			where: { id: req.params.id, userId: req.userId },
			include: { resume: true, coverLetter: true, statusUpdates: true, prepTasks: true },
		});
		if (!app) return res.status(404).json({ error: 'Not found' });
		res.json(app);
	});

	router.put('/:id', async (req: any, res) => {
		const data = req.body as any;
		const app = await prisma.application.update({
			where: { id: req.params.id },
			data: {
				title: data.title,
				company: data.company,
				description: data.description,
				applicationUrl: data.applicationUrl,
				resumeId: data.resumeId || null,
				coverLetterId: data.coverLetterId || null,
				dateApplied: data.dateApplied ? new Date(data.dateApplied) : null,
				status: data.status as any,
			},
		});
		res.json(app);
	});

	router.delete('/:id', async (req: any, res) => {
		await prisma.application.delete({ where: { id: req.params.id } });
		res.json({ ok: true });
	});

	router.post('/:id/status', async (req: any, res) => {
		const { status, note, followUpDate } = req.body as { status: string; note?: string; followUpDate?: string };
		const app = await prisma.application.findFirst({ where: { id: req.params.id, userId: req.userId } });
		if (!app) return res.status(404).json({ error: 'Not found' });
		const update = await prisma.statusUpdate.create({
			data: { applicationId: app.id, status: status as any, note, followUpDate: followUpDate ? new Date(followUpDate) : null },
		});
		await prisma.application.update({ where: { id: app.id }, data: { status: status as any } });
		res.json(update);
	});

	router.get('/:id/calendar', async (req: any, res) => {
		const updates = await prisma.statusUpdate.findMany({ where: { applicationId: req.params.id } });
		const events = updates
			.filter((u: any) => !!u.followUpDate)
			.map((u: any) => ({ id: u.id, title: u.note || 'Follow up', date: u.followUpDate }));
		res.json(events);
	});

	return router;
}

