import { connectDB } from '@/util/database';
import { ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Tab ID is required' });
    }

    try {
      const client = await connectDB;
      const db = client.db('NextCardZone');

      // MongoDB에서 탭 정보(파일 경로 포함) 조회
      const tab = await db.collection('noticeBoard').findOne({ _id: new ObjectId(id) });

      if (!tab) {
        return res.status(404).json({ error: 'Tab not found' });
      }

      // 업로드된 파일 경로가 있으면 파일 삭제
      if (tab.filePath) {
        const filePath = path.join(process.cwd(), 'public', tab.filePath); // 절대 경로로 변환

        // 파일 존재 여부 확인 후 삭제
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); // 파일 삭제
          console.log(`Deleted file: ${filePath}`);
        } else {
          console.warn(`File not found: ${filePath}`);
        }
      }

      // MongoDB에서 해당 탭 삭제
      const result = await db.collection('noticeBoard').deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 1) {
        return res.status(200).json({ message: 'Tab and associated file deleted successfully' });
      } else {
        return res.status(404).json({ error: 'Tab not found' });
      }
    } catch (error) {
      console.error('Failed to delete tab and file:', error);
      return res.status(500).json({ error: 'Failed to delete tab and file' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}