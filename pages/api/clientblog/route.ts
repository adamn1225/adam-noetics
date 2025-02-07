import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { status } = req.body;

        if (status === 'published') {
            try {
                const response = await fetch('/.netlify/functions/triggerWebhook', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status }),
                });

                if (!response.ok) {
                    throw new Error(`Failed to trigger Netlify build. Status: ${response.status}`);
                }

                return res.status(200).json({ message: 'Netlify build triggered successfully' });
            } catch (error) {
                if (error instanceof Error) {
                    return res.status(500).json({ error: error.message });
                } else {
                    return res.status(500).json({ error: 'An unknown error occurred' });
                }
            }
        }

        return res.status(400).json({ error: 'Invalid status' });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
}