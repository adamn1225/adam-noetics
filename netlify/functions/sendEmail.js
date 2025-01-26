const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.mailgun.org',
    port: 587,
    auth: {
        user: process.env.SUPABASE_SMTP_USER,
        pass: process.env.SUPABASE_SMTP_PASS,
    },
});

exports.handler = async (event, context) => {
    const { to, subject, text, userEmail } = JSON.parse(event.body);

    const mailOptionsToOwner = {
        from: process.env.SUPABASE_SMTP_SENDER,
        to,
        subject,
        text,
    };

    const mailOptionsToUser = {
        from: process.env.SUPABASE_SMTP_SENDER,
        to: userEmail,
        subject: 'Thank you for your inquiry',
        text: 'Thanks for your inquiry. One of our professionals will get back to you as soon as possible.',
    };

    try {
        await transporter.sendMail(mailOptionsToOwner);
        await transporter.sendMail(mailOptionsToUser);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Emails sent successfully' }),
        };
    } catch (error) {
        console.error('Error sending email:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error sending email', error: error.message }),
        };
    }
};