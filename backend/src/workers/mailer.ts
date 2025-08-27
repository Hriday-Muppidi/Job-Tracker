import nodemailer from 'nodemailer';

// If @types/nodemailer is missing, NodeNext may complain; this is acceptable for dev builds.

type Mail = { to: string; subject: string; text?: string; html?: string };

export async function sendEmail(mail: Mail) {
	const host = process.env.SMTP_HOST;
	const port = Number(process.env.SMTP_PORT || 1025);
	const secure = String(process.env.SMTP_SECURE || 'false') === 'true';
	const user = process.env.SMTP_USER || '';
	const pass = process.env.SMTP_PASS || '';
	const from = process.env.FROM_EMAIL || 'noreply@example.com';

	if (!host) {
		console.log('[email:fallback]', { to: mail.to, subject: mail.subject });
		return;
	}

	const transporter: any = nodemailer.createTransport({ host, port, secure, auth: user ? { user, pass } : undefined });
	await transporter.sendMail({ from, ...mail });
}

