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
    const { to, subject, text } = JSON.parse(event.body);

    const mailOptions = {
        from: process.env.SUPABASE_SMTP_SENDER,
        to,
        subject,
        text,
    };

    try {
        await transporter.sendMail(mailOptions);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Email sent successfully' }),
        };
    } catch (error) {
        console.error('Error sending email:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error sending email', error: error.message }),
        };
    }
};