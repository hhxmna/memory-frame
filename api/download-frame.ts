import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const chunks: Buffer[] = [];

    await new Promise<void>((resolve, reject) => {
      req.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
      req.on('end', () => resolve());
      req.on('error', (err) => reject(err));
    });

    const buffer = Buffer.concat(chunks);
    if (!buffer.length) {
      return res.status(400).json({ error: 'Empty image payload' });
    }

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'attachment; filename="memory-frame.png"');
    return res.status(200).send(buffer);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('download-frame error', err);
    return res.status(500).json({ error: 'Failed to generate download' });
  }
}

