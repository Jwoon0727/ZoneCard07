import { connectDB } from '@/util/database';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id, imageUrl } = req.body;

    if (!id || !imageUrl) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    try {
      const client = await connectDB;
      const db = client.db('NextCardZone');
      const noticeBoard = db.collection('noticeBoard');

      // MongoDB에서 해당 탭의 데이터를 업데이트하여 이미지 URL 저장
      const result = await noticeBoard.updateOne(
        { _id: new ObjectId(id) },
        { $set: { imageUrl } }
      );

      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: 'Tab not found' });
      }

      return res.status(200).json({ imageUrl });
    } catch (error) {
      console.error('Failed to update tab', error);
      return res.status(500).json({ message: 'Failed to update tab' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}