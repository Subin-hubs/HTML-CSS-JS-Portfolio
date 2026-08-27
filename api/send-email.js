/*
  Vercel-style serverless function to receive contact form data and send email via SMTP.
  Environment variables required:
    SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
    RECAPTCHA_SECRET (optional, recommended)

  Notes: for production use put secrets in the host's env storage (Vercel/Netlify/Cloudflare).
*/
const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { name, email, message, recaptchaToken } = req.body || {};
    if (!name || !email || !message) return res.status(400).json({ error: 'Missing required fields' });

    // Basic input sanitization
    const clean = s => String(s).replace(/<[^>]*>?/gm, '').slice(0, 2000);
    const cname = clean(name), cemail = clean(email), cmsg = clean(message);

    // Optional: verify recaptcha
    if (process.env.RECAPTCHA_SECRET) {
        try {
            const v = await fetch('https://www.google.com/recaptcha/api/siteverify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `secret=${process.env.RECAPTCHA_SECRET}&response=${encodeURIComponent(recaptchaToken || '')}`
            });
            const j = await v.json(); if (!j.success) return res.status(400).json({ error: 'recaptcha failed' });
        } catch (e) { return res.status(500).json({ error: 'recaptcha error' }) }
    }

    // Simple rate limiting (in-memory - ephemeral for serverless; replace with Redis/KV in production)
    if (!global._mailRate) global._mailRate = {};
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const max = 6;
    const entry = global._mailRate[ip] || { count: 0, ts: now };
    if (now - entry.ts < windowMs && entry.count >= max) return res.status(429).json({ error: 'Rate limit exceeded' });
    if (now - entry.ts > windowMs) global._mailRate[ip] = { count: 1, ts: now }; else global._mailRate[ip].count++;

    // Create transporter
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Number(process.env.SMTP_PORT || 587) === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });

    const mail = {
        from: `${cname} <${cemail}>`,
        to: process.env.CONTACT_RECEIVER || process.env.SMTP_USER,
        subject: `Portfolio contact from ${cname}`,
        text: `${cname} (${cemail})\n\n${cmsg}`,
        html: `<p><strong>${cname}</strong> &middot; ${cemail}</p><p>${cmsg.replace(/\n/g, '<br>')}</p>`
    };

    try {
        await transporter.sendMail(mail);
        return res.json({ ok: true });
    } catch (err) {
        console.error('mail error', err);
        return res.status(500).json({ error: 'Failed to send' });
    }
};
