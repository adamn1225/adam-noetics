const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config();

exports.handler = async (event) => {
    const { status } = JSON.parse(event.body);

    if (status === 'published' && process.env.NEXT_NETLIFY_WEBHOOK) {
        try {
            const response = await fetch(process.env.NEXT_NETLIFY_WEBHOOK, { method: 'POST' });
            if (!response.ok) {
                throw new Error('Failed to trigger Netlify build');
            }
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Netlify build triggered successfully' }),
            };
        } catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: error.message }),
            };
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'No action taken' }),
    };
};