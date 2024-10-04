// pages/api/manageBoard.js
import {connectDB} from '@/util/database';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const client = await connectDB;
      const db = client.db('NextCardZone');
      const tabs = await db.collection('noticeBoard').find().toArray();

      res.status(200).json(tabs);
    } catch (error) {
      console.error('Failed to fetch tabs:', error);
      res.status(500).json({ error: 'Failed to fetch tabs' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}