// Email notification service using Resend
import { Resend } from 'resend'

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail(options: EmailOptions): Promise<void> {
  // If no API key is configured, log instead of failing
  if (!process.env.RESEND_API_KEY) {
    console.log('⚠️  RESEND_API_KEY not configured. Email would have been sent:')
    console.log('To:', options.to)
    console.log('Subject:', options.subject)
    console.log('---')
    return
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Instrukcije.hr <noreply@instrukcije.hr>',
      to: [options.to],
      subject: options.subject,
      html: options.html,
      text: options.text,
    })

    if (error) {
      console.error('Failed to send email:', error)
      throw new Error('Failed to send email')
    }

    console.log('✅ Email sent successfully:', data?.id)
  } catch (error) {
    console.error('Email sending error:', error)
    throw error
  }
}

export async function sendBookingConfirmation(params: {
  to: string
  studentName: string
  tutorName: string
  subject: string
  date: Date
  meetingUrl: string
}) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(to right, #0ea5e9, #d946ef); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #0ea5e9; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Potvrda rezervacije</h1>
        </div>
        <div class="content">
          <p>Pozdrav ${params.studentName},</p>
          <p>Vaša rezervacija instrukcije je potvrđena!</p>

          <div class="details">
            <h3>Detalji sesije:</h3>
            <p><strong>Instruktor:</strong> ${params.tutorName}</p>
            <p><strong>Predmet:</strong> ${params.subject}</p>
            <p><strong>Datum i vrijeme:</strong> ${params.date.toLocaleString('hr-HR')}</p>
          </div>

          <p>Pridružite se video pozivu:</p>
          <a href="${params.meetingUrl}" class="button">Pridruži se sesiji</a>

          <p>Vidimo se!</p>
          <p>Tim Instrukcije.hr</p>
        </div>
      </div>
    </body>
    </html>
  `

  await sendEmail({
    to: params.to,
    subject: `Potvrda rezervacije - ${params.subject}`,
    html,
  })
}

export async function sendNewMessageNotification(params: {
  to: string
  recipientName: string
  senderName: string
  messagePreview: string
}) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(to right, #0ea5e9, #d946ef); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .message { background: white; padding: 15px; border-left: 4px solid #0ea5e9; margin: 20px 0; }
        .button { display: inline-block; padding: 12px 30px; background: #0ea5e9; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Nova poruka</h1>
        </div>
        <div class="content">
          <p>Pozdrav ${params.recipientName},</p>
          <p><strong>${params.senderName}</strong> vam je poslao poruku:</p>

          <div class="message">
            <p>${params.messagePreview}</p>
          </div>

          <a href="${process.env.NEXTAUTH_URL}/messages" class="button">Pročitaj poruku</a>
        </div>
      </div>
    </body>
    </html>
  `

  await sendEmail({
    to: params.to,
    subject: `Nova poruka od ${params.senderName}`,
    html,
  })
}

export async function sendReviewNotification(params: {
  to: string
  tutorName: string
  rating: number
  comment: string
}) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(to right, #0ea5e9, #d946ef); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .rating { color: #fbbf24; font-size: 24px; }
        .review { background: white; padding: 15px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Nova recenzija</h1>
        </div>
        <div class="content">
          <p>Pozdrav ${params.tutorName},</p>
          <p>Dobili ste novu recenziju!</p>

          <div class="review">
            <div class="rating">${'★'.repeat(params.rating)}${'☆'.repeat(5 - params.rating)}</div>
            <p>${params.comment}</p>
          </div>

          <p>Nastavite s odličnim radom!</p>
        </div>
      </div>
    </body>
    </html>
  `

  await sendEmail({
    to: params.to,
    subject: `Nova recenzija - ${params.rating}/5 zvjezdica`,
    html,
  })
}

export async function sendSessionReminder(params: {
  to: string
  userName: string
  sessionTime: Date
  meetingUrl: string
  tutorName: string
  subject: string
}) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(to right, #0ea5e9, #d946ef); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .alert { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
        .button { display: inline-block; padding: 12px 30px; background: #0ea5e9; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Podsjetnik na sesiju</h1>
        </div>
        <div class="content">
          <p>Pozdrav ${params.userName},</p>

          <div class="alert">
            <p><strong>Vaša sesija počinje za 15 minuta!</strong></p>
          </div>

          <p><strong>Instruktor:</strong> ${params.tutorName}</p>
          <p><strong>Predmet:</strong> ${params.subject}</p>
          <p><strong>Vrijeme:</strong> ${params.sessionTime.toLocaleString('hr-HR')}</p>

          <a href="${params.meetingUrl}" class="button">Pridruži se sada</a>
        </div>
      </div>
    </body>
    </html>
  `

  await sendEmail({
    to: params.to,
    subject: `Podsjetnik: Sesija počinje za 15 minuta`,
    html,
  })
}
