import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create reusable transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    // Use an App Password if you have 2FA enabled
    // https://support.google.com/accounts/answer/185833
    pass: process.env.GMAIL_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, subject, html } = body;

    const msg = {
      from: 'info@avgouste.gr',
      to,
      subject,
      html,
    };

    try {
      await transporter.sendMail(msg);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Email error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Request error:', error);
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
} 