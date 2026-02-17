import { transporter } from '../config/email.ts';
import nodemailer from 'nodemailer';
import type { IUser } from '../models/user.model.ts';
import type { ITicket } from '../models/ticket.model.ts';

// Generic sender function
async function sendEmail(to: string, subject: string, html: string) {
  try {

    const info = await transporter.sendMail({
      from: '"TechSphere Support" <support@techsphere.com>',
      to,
      subject,
      html,
    });

    console.log(`📧 Email sent: ${info.messageId}`);

    // Only available when using Ethereal:
    if (nodemailer.getTestMessageUrl(info)) {
      console.log(`🔗 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
}

// Notify: Ticket Update
export async function notifyTicketUpdate(user: IUser, ticket: ITicket) {
  const subject = `[Ticket #${ticket._id}] Update on your request: ${ticket.title}`;
  const html = `
    <h3>Hello ${user.name},</h3>
    <p>Your support request has been updated.</p>
    <p><strong>Title:</strong> ${ticket.title}</p>
    <p><strong>Description:</strong> ${ticket.description}</p>
    <p><strong>Status:</strong> ${ticket.status}</p>
    <p><strong>Priority:</strong> ${ticket.priority}</p>
    <p>We will keep you informed of any further updates.</p>
  `;
  await sendEmail(user.email, subject, html);
}