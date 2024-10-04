import { connectDB } from '@/util/database';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, content } = req.body;

    // 입력 데이터 확인
    if (!title || !content) {
      console.error('Title or content is missing');
      return res.status(400).json({ error: 'Title and content are required' });
    }

    try {
        const client = await connectDB;
        const db = client.db('NextCardZone');
      const newTab = { title, content };

      // 디버깅을 위해 로깅 추가
      console.log('Inserting new tab:', newTab);
      
      await db.collection('noticeBoard').insertOne(newTab);

      res.status(200).json({ message: 'Tab added successfully', tab: newTab });
    } catch (error) {
      console.error('Failed to insert tab:', error); // 에러 로그
      res.status(500).json({ error: 'Failed to add tab to the database' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}