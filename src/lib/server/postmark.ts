import * as postmark from 'postmark';
import { env } from '$env/dynamic/private';

const serverToken = env.POSTMARK_SERVER_TOKEN || '8268ec56-d6c1-44b5-9a52-68dbb266dfe7';
const client = new postmark.ServerClient(serverToken);

interface SendContactEmailParams {
	toEmail: string;
	senderName: string;
	senderEmail: string;
	subject: string;
	message: string;
}

export async function sendContactNotificationEmail({
	toEmail,
	senderName,
	senderEmail,
	subject,
	message
}: SendContactEmailParams) {
	const fromEmail = env.POSTMARK_FROM_EMAIL || 'yusril.maqoshidana@gmail.com';
	const recipient = toEmail || 'yusril.maqoshidana@gmail.com';

	const emailSubject = `[Portfolio Contact] ${subject || 'New Message'} from ${senderName}`;
	const textBody = `Halo Yusril,\n\nAnda menerima pesan baru melalui formulir kontak Portofolio Anda:\n\nNama: ${senderName}\nEmail: ${senderEmail}\nSubjek: ${subject || '-'}\n\nPesan:\n${message}\n\n---\nPesan ini dikirim secara otomatis melalui sistem Portofolio.`;

	const htmlBody = `
	<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #30363d; border-radius: 12px; background-color: #0d1117; color: #e6edf3;">
		<h2 style="color: #2dd4bf; margin-top: 0;">Pesan Kontak Baru Portofolio</h2>
		<p style="color: #94a3b8; font-size: 14px;">Seseorang telah mengirimkan pesan melalui formulir kontak portofolio Anda.</p>
		<hr style="border: none; border-top: 1px solid #30363d; margin: 20px 0;" />
		
		<table style="width: 100%; border-collapse: collapse; color: #e6edf3; font-size: 14px;">
			<tr>
				<td style="padding: 8px 0; font-weight: bold; width: 100px; color: #2dd4bf;">Pengirim:</td>
				<td style="padding: 8px 0;">${senderName}</td>
			</tr>
			<tr>
				<td style="padding: 8px 0; font-weight: bold; color: #2dd4bf;">Email:</td>
				<td style="padding: 8px 0;"><a href="mailto:${senderEmail}" style="color: #38bdf8; text-decoration: none;">${senderEmail}</a></td>
			</tr>
			<tr>
				<td style="padding: 8px 0; font-weight: bold; color: #2dd4bf;">Subjek:</td>
				<td style="padding: 8px 0;">${subject || '-'}</td>
			</tr>
		</table>

		<hr style="border: none; border-top: 1px solid #30363d; margin: 20px 0;" />

		<div style="background-color: #161b22; padding: 16px; border-radius: 8px; border: 1px solid #30363d;">
			<h4 style="margin-top: 0; color: #2dd4bf;">Isi Pesan:</h4>
			<p style="white-space: pre-line; line-height: 1.6; margin-bottom: 0; color: #cbd5e1; font-size: 14px;">${message}</p>
		</div>

		<div style="margin-top: 25px; text-align: center;">
			<a href="mailto:${senderEmail}?subject=Re: ${encodeURIComponent(subject || 'Balasan Kontak Portofolio')}" 
			   style="background-color: #0d9488; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 14px;">
				Balas Langsung via Email
			</a>
		</div>
	</div>
	`;

	try {
		const response = await client.sendEmail({
			From: fromEmail,
			To: recipient,
			ReplyTo: senderEmail,
			Subject: emailSubject,
			TextBody: textBody,
			HtmlBody: htmlBody,
			MessageStream: 'outbound',
			Tag: 'portfolio-contact'
		});

		console.log('Postmark email sent successfully! MessageID:', response.MessageID);
		return { success: true, messageId: response.MessageID };
	} catch (error: any) {
		console.error('Postmark error sending email:', error?.message || error);
		return { success: false, error: error?.message || 'Failed to send email via Postmark' };
	}
}
