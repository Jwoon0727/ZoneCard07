import { connectDB } from '@/util/database';
import { ObjectId } from 'mongodb';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    try {
      const client = await connectDB;
      const db = client.db('NextCardZone');
      const noticeBoard = db.collection('noticeBoard');

      // 해당 탭의 데이터를 가져오기
      const tab = await noticeBoard.findOne({ _id: new ObjectId(id) });

      if (!tab) {
        return res.status(404).json({ message: 'Tab not found' });
      }

      // MongoDB에서 탭 삭제
      const result = await noticeBoard.deleteOne({ _id: new ObjectId(id) });

      // 파일이 존재하면 AWS S3에서 파일 삭제
      if (tab.imageUrl) {
        const fileName = tab.imageUrl.split('/').pop(); // S3 파일 이름 추출
        const deleteParams = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: fileName, // 파일명 지정
        };

        try {
          await s3.send(new DeleteObjectCommand(deleteParams));
          console.log('File deleted successfully from S3');
        } catch (err) {
          console.error('Error deleting file from S3:', err);
        }
      }

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Tab not found' });
      }

      return res.status(200).json({ message: 'Tab and associated file deleted successfully' });
    } catch (error) {
      console.error('Failed to delete tab:', error);
      return res.status(500).json({ message: 'Failed to delete tab' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}